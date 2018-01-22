"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Error) {
  _inherits(UtilError, _Error);

  function UtilError(message, node) {
    _classCallCheck(this, UtilError);

    var _this = _possibleConstructorReturn(this, (UtilError.__proto__ || Object.getPrototypeOf(UtilError)).call(this, message));

    _this.message = message + "\nFrom: plugin-util\n\nNode: " + JSON.stringify(node, null, 2);

    Error.captureStackTrace(_this, _this.constructor);
    return _this;
  }

  return UtilError;
}(Error);
