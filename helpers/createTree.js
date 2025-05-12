// let count = 0; 
 function createTree(arr, parentId = "",count = 0) {
    const tree = [];

    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        count++;
        const newItem = item;
        newItem.index=count;
        const children = createTree(arr, item.id,count);

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
//     count = 0;
//     const tree = createTree(arr,parentId);
//     return tree;
// }

//Cách đơn giản hơn:
// module.exports = {
// createTree,
// };
// module.exports.createTree = createTree;
module.exports = createTree;

