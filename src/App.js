import React from 'react';
import './App.css';
import ActionCable from 'actioncable'

class App extends React.Component {
  state = { text: '' }

  componentDidMount() {
    fetch("http://localhost:3000/notes/1")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({ text: result.text })
      },
      (error) => {
        this.setState({ text: '' })
      }
    )
    const cable = ActionCable.createConsumer('ws://localhost:3000/cable')
    this.sub = cable.subscriptions.create('NotesChannel', {
      received: this.handleReceiveNewText
    })
  }

  handleReceiveNewText = ({ text }) => {
    if (text !== this.state.text) {
      this.setState({ text })
    }
  }
  
  handleChange = e => {
    this.setState({ text: e.target.value })
    this.sub.send({ text: e.target.value, id: 1 })
  }

  render() {
    return (
      <textarea
        value={this.state.text}
        onChange={this.handleChange}
      />
    )
  }
}

export default App;
