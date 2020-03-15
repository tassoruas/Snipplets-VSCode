const vscode = require('vscode');
const json = require('jsonc-parser');

class SnippetTreeView {
  constructor(data) {
    this.parseTree(data);
  }

  static getSelected() {
    return this.selected;
  }

  parseTree(data) {
    try {
      this.tree = null;
      this.text = JSON.stringify(data);
      this.tree = json.parseTree(this.text);
    } catch (error) {
      console.log('parseTree error', error);
    }
  }

  getChildren(offset) {
    try {
      if (offset) {
        const path = json.getLocation(this.text, offset).path;
        const node = json.findNodeAtLocation(this.tree, path);
        return Promise.resolve(this.getChildrenOffsets(node));
      } else {
        return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
      }
    } catch (error) {
      console.log('getChildren: error', error);
    }
  }

  getChildrenOffsets(node) {
    try {
      const offsets = [];
      for (const child of node.children) {
        const childPath = json.getLocation(this.text, child.offset).path;
        const childNode = json.findNodeAtLocation(this.tree, childPath);
        if (childNode) {
          offsets.push(childNode.offset);
        }
      }
      return offsets;
    } catch (error) {
      console.log('getChildrenOffsets error', error);
    }
  }

  getTreeItem(offset) {
    try {
      const path = json.getLocation(this.text, offset).path;
      const valueNode = json.findNodeAtLocation(this.tree, path);
      if (valueNode) {
        let hasChildren = valueNode.type === 'array';
        let name = this.getLabel(valueNode);
        let treeItem = new vscode.TreeItem(name, hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        treeItem.contextValue = valueNode.type;
        treeItem.id = valueNode.children[0].children[1].value; // Get id
        treeItem.name = name;
        treeItem.content = valueNode.children[2].children[1].value; // Get base64 snippet data
        treeItem.language = valueNode.children[3].children[1].value; // Get language
        return treeItem;
      }
      return null;
    } catch (error) {
      console.log('getTreeItem error', error);
    }
  }

  getLabel(node) {
    try {
      if (node.type == 'string' || node.type == 'number') {
        return node.parent.children[0].parent.children[1].value.toString();
      }

      if (node.parent.type === 'array') {
        // let value = node.children[0].children[1].value.toString();
        let value = node.children[1].children[1].value.toString(); // Get snippet title

        if (node.type === 'array' || node.type === 'object') {
          return value;
        }

        return node.value.toString();
      } else {
        const property = node.parent.children[0].value.toString();
        if (node.type === 'array' || node.type === 'object') {
          return property;
        }
        return 'error';
      }
    } catch (error) {
      console.log('getLabel error', error);
    }
  }
}

module.exports = SnippetTreeView;
