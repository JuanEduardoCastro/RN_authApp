const React = require('react');
const SvgMock = ({ testID, ...props }) =>
  React.createElement('svg', { testID, ...props });
module.exports = SvgMock;
module.exports.default = SvgMock;
module.exports.ReactComponent = SvgMock;
