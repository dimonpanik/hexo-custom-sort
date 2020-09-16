var pagination = require('hexo-pagination');
const util = require('hexo-util');
const slugize = util.slugize

hexo.config.custom_sort = Object.assign({
    params: hexo.config.custom_sort.params,
    pathPage: hexo.config.custom_sort.pathPage || 'page',
    perPage: hexo.config.custom_sort.perPage || 20
}, hexo.config.custom_sort);

hexo.extend.generator.register('hexo-custom-sort', function(locals){

    const allPosts = locals.posts;
    const parameters = []
    hexo.config.custom_sort.params.forEach(item=>{
        var tmp = item.split('|')
        if(!Object.prototype.hasOwnProperty.call(parameters,item)){
            parameters[tmp[0]] = tmp[1]
        }
    })
    const ItemPosts = {}
    const paramsKeys = Object.keys(parameters)
    let result = []

    function generate(path, posts, options) {
        options = options || {};
    
        result = result.concat(pagination(path, posts, {
          perPage: hexo.config.custom_sort.perPage,
          layout: ['tag', 'index'],
          format: hexo.config.custom_sort.pathPage + '/%d/',
          data: options
        }));
      }

        allPosts.forEach(post =>{
            for(const[key,value] of Object.entries(parameters)){
                if(typeof(post[key]) !== 'undefined'){  
                    if(typeof(post[key]) !== 'object'){
                        if(!Object.prototype.hasOwnProperty.call(ItemPosts, key)){
                            ItemPosts[key] = []
                        }
                        if (!Object.prototype.hasOwnProperty.call(ItemPosts[key], post[key])) {
                            ItemPosts[key][post[key]] = [];
                        }
                        ItemPosts[key][post[key]].push(post)
                    }else{
                        post[key].forEach(coll =>{
                            if(!Object.prototype.hasOwnProperty.call(ItemPosts,key)){
                                ItemPosts[key] = []
                            }
                            if (!Object.prototype.hasOwnProperty.call(ItemPosts[key], coll)) {
                                ItemPosts[key][coll] = [];
                            }
                            ItemPosts[key][coll].push(post)
                        })
                    }
                    
                }
            }
        })
        for( const [name,arr] of Object.entries(ItemPosts)){
            console.log(name + " contain "+ arr.length + " entries.")
            hexo.locals.set(name, function(){
                return arr
              });
            //console.log(arr)
            const Query = this.model('Post').Query;
            for(const[key,value] of Object.entries(arr)){
                if (!value.length) continue;
                generate(slugize(key), new Query(value), {key: key});
            }
        }
        
    
    
  
    return result;
});