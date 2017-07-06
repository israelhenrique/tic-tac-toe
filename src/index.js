import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
      <button className="square" style={props.color} onClick={props.onClick}>
        {props.value}
      </button>
    );
}

function Button(props){
    return (
      <button className="button" onClick={props.onClick}>
        {props.value}
      </button>
    );
}


class Board extends React.Component {
  constructor() {
    super();

    let player1 = prompt('Enter player 1 name')
    let player2 = prompt('Enter player 2 name')

    this.state = {
      players : setPlayers(player1,player2),
      scores : Array(2).fill(0),
      squares: Array(9).fill(null),
      xIsNext: true,
      squaresColor: Array(9).fill(null),
      movesCount: 0,
      winner: null,
    };
  }


  refreshScore(winner){

    const scores = this.state.scores.slice()

    if (winner === this.state.players.player1){

      scores[0]++;
      console.log('entrou')

    } else {

      scores[1]++;

    }

    this.setState({
      scores: scores,

    });

  }

  handleClick(i) {

      const squares = this.state.squares.slice();

      if(this.state.winner){
        alert('Start a new game!')
        return
      }else if (squares[i] != null){
        alert('Click in a empty square!')
        return
      }


      const squaresColor = this.state.squaresColor.slice();

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      squaresColor[i] = this.state.xIsNext ? {background: 'red'} : {background: 'green'}

      const winner = calculateWinner(squares,this.state.players)

      if (winner !== null){

        this.refreshScore(winner)

      }


      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
        squaresColor: squaresColor,
        movesCount: this.state.movesCount+1,
        winner: winner
      });
  }

  newMatch(){
    const squares = Array(9).fill(null)
    const squaresColor =  Array(9).fill(null)
    this.setState({
      squares: squares,
      xIsNext: true,
      squaresColor: squaresColor,
      movesCount: 0,
      winner: null
    });

  }

  newGame(){
    const squares = Array(9).fill(null)
    const squaresColor =  Array(9).fill(null)

    let player1 = prompt('Enter player 1 name')
    let player2 = prompt('Enter player 2 name')

    this.setState({
      players : setPlayers(player1,player2),
      scores : Array(2).fill(0),
      squares: squares,
      xIsNext: true,
      squaresColor: squaresColor,
      movesCount: 0,
      winner: null
    });

  }

  renderSquare(i) {
    return <Square
      value={this.state.squares[i]} color={this.state.squaresColor[i]} onClick={() => this.handleClick(i)} />;
  }

  render() {
    const winner = this.state.winner;
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.movesCount !== 9) {
      status = 'Next player: ' + (this.state.xIsNext ? this.state.players.player1 : this.state.players.player2);
    } else {
      status = 'A tie!';
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <Button value='New Game' onClick={() => this.newGame()}/>
        <Button value='New Match' onClick={() => this.newMatch()}/>
        <div><p>{this.state.players.player1+' '+this.state.scores[0]+' vs '+this.state.scores[1]+' '+this.state.players.player2}</p></div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div></div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

class StartForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});

  }

  handleClick(){
    this.props._handleStartFormSubmit(this.state.value) //O método handleClick chama o handle passado em props?
  }

  render() {
    return(
      <div>
        <label>Player 1</label>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handleClick}>Botão</button> //Imagino que o evento onClick do botão chama a função handleClick
      </div>
      )
  }


}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      players : Array(2).fill(0),
      started : false
    };
  }
  _handleStartFormSubmit(player) {
    console.log(player)
    this.setState({
      started : !this.state.started,
    });
  }

  render() {
    return(
      <div>
        {this.state.started ? (
          <Game players={this.state.players} />
        ) : (
          <StartForm _handleStartFormSubmit={() => this._handleStartFormSubmit()} /> //Preciso passar parametros aqui? Suponho que o problema esteja aqui
        )}
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


function setPlayers(player1, player2){

  if(player1 !== null && player1 === player2) {
    console.log('Teste')
    player1 = player1 + ' (X)'
    player2 = player2 + ' (O)'
  }
  if (player1 === null || player1 === '')
    player1 = 'X'
  if (player2 === null || player2 === '')
    player2 = 'O'

    return {player1: player1, player2: player2}

}

function calculateWinner(squares, players) {
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
      if(squares[a] === 'X')
        return players.player1;
      else
        return players.player2;
    }
  }
  return null;
}
