const PubSub = require('pubsub-js');
const scenarios = require('./scenarios')
const Animation = require('./animation');
const {LimitBoardWip} = require('../src/strategies');
const TimeAdjustments = require('./timeAdjustments');
const Stats = require('./stats');
const WorkerStats = require('./worker-stats');
const Scenario = require("./scenario");
const LineChart = require("./charts");
const Cfd = require("./CumulativeFlowDiagram");
const {parseInput} = require("./parsing");

// force repeatable randomness
const seedrandom = require('seedrandom');
const FormHelper = require("./form-helper");

// Store scenario data for replay
const scenarioData = new Map();

function createScenarioContainer(scenario) {
    const template = document.querySelector('#scenario-template');

    const clone = template.content.cloneNode(true).querySelector('ul');
    clone.setAttribute('id', `scenario-${scenario.id}`);
    clone.setAttribute('data-wip-limit', scenario.wipLimit || '');
    clone.setAttribute('data-stories', scenario.stories?.amount || '');
    clone.querySelector('.scenario-title').textContent = scenario.title;

    // Add replay button click handler
    const replayBtn = clone.querySelector('.replay-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            const storedScenario = scenarioData.get(scenario.id);
            if (storedScenario) {
                run(storedScenario);
            }
        });
    }

    return clone;
}

function parse(form) {
  const field = fieldName => form.querySelector(`[name="${fieldName}"]`).value;

  return parseInput({
      title: field('workload'),
      workers: field('workers'),
      workload: field('workload'),
      wipLimit: field('wip-limit'),
      numberOfStories: field('numberOfStories'),
      random: form.querySelector('[name="random"]').checked
  });
}

function parseScenario(event) {
  return Scenario(parse(event.target));
}

document.addEventListener('DOMContentLoaded', () => {
    const form = FormHelper.initialize();
    const runButton = document.getElementById('create-scenario');

    document.getElementById('new-scenario')
      .addEventListener('submit', event => {
        event.preventDefault()
        if(!form.isValid()) return;

        // Disable run button while simulation is running
        runButton.disabled = true;

        const scenario = parseScenario(event);
        const $container = createScenarioContainer(scenario);
        const $scenarios = document.getElementById('scenarios');

        const $lastScenario = document.getElementsByClassName('scenario instance')[0];
        $scenarios.insertBefore($container, $lastScenario);

        run(scenario);

        // Re-enable run button when simulation is complete
        PubSub.subscribe('board.done', () => {
            runButton.disabled = false;
        });
      })
});

const wipLimiter = LimitBoardWip();

let lineChart = undefined;
let cfd = undefined;

function run(scenario) {
    PubSub.clearAllSubscriptions();

    // force predictable randomness across each simulation
    seedrandom('limit work in progress', {global: true});

    // Store scenario data for replay
    scenarioData.set(scenario.id, scenario);

    // Remove active class from all scenarios
    document.querySelectorAll('.scenario.instance').forEach(el => el.classList.remove('active'));
    // Add active class to current scenario
    document.querySelector(`#scenario-${scenario.id}`).classList.add('active');

    Animation.initialize(`#scenario-${scenario.id}`);
    Stats.initialize();

    new WorkerStats();
    document.title = scenario.title
    TimeAdjustments.speedUpBy(scenario.speed || 1);

    wipLimiter.initialize(scenario.wipLimit)
    if(lineChart) lineChart.destroy()
    lineChart = LineChart(document.getElementById('lineChart'), 1000, scenario.speed)

    if(cfd) cfd.destroy()
    cfd = Cfd(document.getElementById('cfd'), 2000, scenario.speed)

    const board = scenario.run();
}

