const Board = require('./board');
const {generateWorkItems} = require('./generator');
const {Worker} = require('./worker');

let counter = 1;

const Scenario = scenario => {
  const id = counter++;
  const wipLimit = scenario.wipLimit || scenario.stories.amount;

  const createWorker = ({ skills: skillNames }, speed = 1) => {
    let skills = {};
    skillNames.forEach(skillName => skills[skillName] = speed);
    return new Worker(skills);
  };

  const columnNames = () => Object.keys(scenario.stories.work);

  const generateStory = () => {
    const story = {};
    let distribute = scenario.distribution || (identity => identity);
    columnNames().forEach(key => {
      let givenValue = scenario.stories.work[key];
      story[key] = distribute(givenValue);
    });
    return story;
  };

  const run = () => {
    const board = new Board(columnNames());
    const workers = scenario.workers.map(workerDetails => createWorker(workerDetails));
    const workItems = generateWorkItems(generateStory, scenario.stories.amount);
    board.addWorkers.apply(board, workers);
    board.addWorkItems.apply(board, workItems);
    this.board = Object.assign({}, board);
    return this.board;
  };

  return Object.assign({}, scenario, { run, id, wipLimit });
};

module.exports = Scenario;