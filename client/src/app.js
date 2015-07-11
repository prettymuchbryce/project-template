var React = require('react');
var TestComponent = require('./jsx/test-component.jsx');

var element = React.createElement(TestComponent);
React.render(element, $('#react-container')[0]);