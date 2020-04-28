import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { 
  let squareClass = 'square';
  
  if(props.selected) {    
      squareClass += ' selected';       
  }
 
    return (
      <button className={squareClass} onClick={props.onClick}>
        {props.value}
      </button>
    );
  
}

class Board extends React.Component {
  
  renderSquare(i, x, y, selected) {
    return <Square 
              value={this.props.squares[i]} 
              onClick={() => this.props.onClick(i, x, y)}
              selected={selected} 
            />;
  }  

  createSquare() {
    let table = [];
    let count = 0;
    let selected = false;

    for(let i=0; i<3; i++) {
      let children = [];
      for(let j=0; j<3; j++) {
        if(this.props.winner && (this.props.winner.win).includes(count)) {
          selected = true;
        }
        children.push(this.renderSquare(count, i+1, j+1, selected));
        count++;
        selected = false;
      }
      table.push(<div className="board-row">{children}</div>);      
    }

    return table;
  }

  render() { 
    return (
      <div>    
       {this.createSquare()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),  
        stepNumber: 0,
        x: 0,
        y: 0,      
      }],
      xIsNext: true,
      stepNumber: 0,
      isIncreasingOrdered: true,
    };
  }

  handleClick(i, x, y) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); 
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        stepNumber: history.length,
        x: x,
        y: y,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });

   // console.log(this.state.stepNumber);
  }

  sort() {
    let history = this.state.history;    
    history.reverse();

    this.setState({
      history: history,
      isIncreasingOrdered: !this.state.isIncreasingOrdered
    });
  }

  createHistoryList(history) {
    const moves = history.map((step, move) => {
      const desc = step.stepNumber ? 'Move to #'  + step.stepNumber + ': (' + step.y + ',' + step.x + ')' : 'Move to the game start';
      
      const properDesc = (this.state.stepNumber === move) ? <strong>{desc}</strong> : desc;

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}> 
           {properDesc}
          </button>          
        </li>
      );
    });

    return moves;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = this.createHistoryList(history);

    let status;
    if (winner) {
      status = 'Win: ' + winner.val;
    } else if (this.state.stepNumber === 9) {
      status = 'Sorry, there is no move available';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const sorting = <button onClick={() => this.sort()}>Sort</button>;

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i, x, y) => { this.handleClick(i, x, y) }}
            winner={winner} />
        </div>
        <div className="game-info">
          <div className="status">
            <div>{status}</div>
            <div>{sorting}</div>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {     
      return { 
        val: squares[a],
        win: [a, b, c] 
      };
    }
  }
  return null;
}

