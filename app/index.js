import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

import './app.global.css';

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    if (styleSheet.cssRules) { // true for inline styles
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach(cssRule => {
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) { // true for stylesheets loaded from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

class MyWindowPortal extends React.PureComponent {
  constructor(props) {
    super(props);

    // This will prevent to pre-render the children in the main app before inserting them in the portal
    this.state = {
      mounted: false
    };

    this.containerEl = document.createElement('div');
    this.externalWindow = null;
  }

  componentDidMount() {
    this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');
    this.externalWindow.document.body.appendChild(this.containerEl);
    this.externalWindow.document.title = 'A React portal window';
    copyStyles(document, this.externalWindow.document);

    this.externalWindow.addEventListener('beforeunload', () => {
      this.props.closeWindowPortal();
    });

    // To load and render the content of the portal
    this.setState({
      mounted: true
    });
  }

  componentWillUnmount() {
    this.externalWindow.close();
  }

  render() {
    return ReactDOM.createPortal(this.state.mounted ? this.props.children : null, this.containerEl);
  }
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      showWindowPortal: false,
    };


    this.onChange = this.onChange.bind(this);
    this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
    this.closeWindowPortal = this.closeWindowPortal.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', () => {
      this.closeWindowPortal();
    });
  }

  onChange(text) {
    console.log('onChange', text);
    this.setState({
      text
    });
  }

  toggleWindowPortal() {
    this.setState({
      showWindowPortal: !this.state.showWindowPortal,
    });
  }

  closeWindowPortal() {
    this.setState({ showWindowPortal: false })
  }

  render() {
    const {text} = this.state;
    return (
      <div>
        <h1>Composer</h1>

        <button onClick={this.toggleWindowPortal}>
          {this.state.showWindowPortal ? 'Close the' : 'Open a'} composer
        </button>

        <br /><br />
        <div>
          Composer content: "{text}"
        </div>

        {this.state.showWindowPortal && (
          <MyWindowPortal closeWindowPortal={this.closeWindowPortal} >
            <SimpleEditor
              onChange={this.onChange} />
          </MyWindowPortal>
        )}
      </div>
    );
  }
}

class SimpleEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      text: '',
    };


    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState) {
    const text = editorState.getCurrentContent().getPlainText();
    console.log(text);
    if (this.props.onChange)
      this.props.onChange(text);

    this.setState({
      editorState,
      text
    });
  }

  render() {
    const {editorState, text} = this.state;
    return (
      <div>
        <h1>Composer</h1>

        <Editor
          editorState={editorState}
          onChange={this.onChange} />

        <br /><br />
        <div>
          Composer content: "{text}"
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
