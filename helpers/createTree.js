 function createTree(arr, parentId = "") {
    const tree = [];

    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item;
        const children = createTree(arr, item.id);

        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

// 28tech
// module.exports.createTree = (arr,parentId = "") =>{
//     const tree = createTree(arr,parentId);
//     return tree;
// }

//Cách đơn giản hơn:
// module.exports = {
// createTree,
// };
// module.exports.createTree = createTree;
module.exports = createTree;

