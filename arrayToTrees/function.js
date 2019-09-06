var arrayToTrees = function(arr, option){
    var key = 'id' || option.key;
    var parentKey = 'parentId' || option.parentKey;
    var childrenKey = 'children' || option.childrenKey;
    var meta = {};
    var result = [];
    var kids = [];
    arr.forEach(function(it){
        it[childrenKey] = [];
        meta[it[key]] = it;
        if (!it[parentKey]){
            result.push(it);
        } else {
            kids.push(it);
        }
    });
    kids.forEach(function(it){
        meta[it[parentKey]][childrenKey].push(it);
    });
    return result;
};


/**
 * 以下是一些测试数据
 */
var treeRawData = [
    {id: 1, value: '动物', parentId: 8},
    {id: 2, value: '芦荟', parentId: 5},
    {id: 3, value: '狮子', parentId: 6},
    {id: 4, value: '猎豹', parentId: 6},
    {id: 5, value: '植物', parentId: 8},
    {id: 6, value: '猫科', parentId: 1},
    {id: 7, value: '灰狼', parentId: 10},
    {id: 8, value: '生物', parentId: null},
    {id: 9, value: '狐狸', parentId: 10},
    {id: 10, value: '犬科', parentId: 1},
    {id: 11, value: '猞猁', parentId: 6},
    {id: 12, value: '仙人掌', parentId: 5},
    {id: 13, value: '菊花', parentId: 5},
    {id: 14, value: '老虎', parentId: 6},
];

var forestRawData = [
    {id: 1, value: '动物', parentId: null},
    {id: 2, value: '芦荟', parentId: 5},
    {id: 3, value: '狮子', parentId: 6},
    {id: 4, value: '猎豹', parentId: 6},
    {id: 5, value: '植物', parentId: null},
    {id: 6, value: '猫科', parentId: 1},
    {id: 7, value: '灰狼', parentId: 10},
    {id: 8, value: '微生物', parentId: null},
    {id: 9, value: '狐狸', parentId: 10},
    {id: 10, value: '犬科', parentId: 1},
    {id: 11, value: '猞猁', parentId: 6},
    {id: 12, value: '仙人掌', parentId: 5},
    {id: 13, value: '菊花', parentId: 5},
    {id: 14, value: '老虎', parentId: 6},
];

var treeData = arrayToTrees(treeRawData);
var forestData = arrayToTrees(forestRawData);