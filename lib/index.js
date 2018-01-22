'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var when = require('when');
var UtilError = require('./error');

exports.modifyNodes = function modifyNodes(tree, criteria, transform) {
  return when.reduce(tree, function (m, node) {
    // this will resolve immediately unless the node has children and needs to
    // recurse, in which case it will wait for the recursion to finish before
    // resolving
    var maybeRecurse = when.resolve();

    // bottom-up recurse if there is a tag with contents
    if (node.type === 'tag' && node.content) {
      maybeRecurse = modifyNodes(node.content, criteria, transform).tap(function (content) {
        node.content = content;
      });
    }

    // after the recurse has finished if applicable, test the node for the user
    // criteria and modify if applicable
    return maybeRecurse.then(function () {
      // run the criteria function (can be a promise)
      return when.resolve(criteria(node)).then(function (processNode) {
        // if it doesn't match the criteria, move on
        if (!processNode) {
          m.push(node);return m;
        }

        // if it does, run the user transform (can be a promise)
        return when.resolve(transform(node)).then(function (output) {
          // push the output into the tree if it's a valid type
          if (Array.isArray(output)) {
            m.push.apply(m, _toConsumableArray(output));
          } else if ((typeof output === 'undefined' ? 'undefined' : _typeof(output)) === 'object') {
            m.push(output);
          } else if (!output) {
            // no node added
          } else {
            throw new UtilError('invalid replacement node', output);
          }
          return m;
        });
      });
    });
  }, []);
};

function validateNode(node) {
  if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object' || Array.isArray(node)) {
    throw new UtilError('node must be an object', node);
  }

  if (!node.type) {
    throw new UtilError('node must have a "type" property', node);
  }

  if (node.type === 'tag') {
    if (node.content && !Array.isArray(node.content)) {
      throw new UtilError("tag node's content must be an array", node);
    }

    if (node.attrs) {
      if (_typeof(node.attrs) !== 'object' || Array.isArray(node.attrs)) {
        throw new UtilError('attributes must be an object', node);
      }

      for (var k in node.attrs) {
        if (!Array.isArray(node.attrs[k])) {
          throw new UtilError('attribute value for ' + k + ' must be an array', node);
        }
      }
    }
  }

  if (node.type === 'text' || node.type === 'comment' || node.type === 'code') {
    if (node.content && typeof node.content !== 'string') {
      throw new UtilError(node.type + ' node contents should be a string', node);
    }
  }

  if (node.type === 'code') {
    if (node.content.match(/__nodes/) && !node.nodes) {
      throw new UtilError('You must have a "nodes" property in order to use the "__nodes" code helper', node);
    }

    if (node.nodes && !Array.isArray(node.nodes)) {
      throw new UtilError('"nodes" property must be an array');
    }
  }
}

exports.validateNode = validateNode;

function validateTree(tree) {
  tree.map(function (node) {
    if (node.type === 'tag' && node.content) validateTree(node.content);
    validateNode(node);
  });
}

exports.validateTree = validateTree;