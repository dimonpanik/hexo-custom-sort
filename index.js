var pagination = require('hexo-pagination');
const util = require('hexo-util');
const slugize = util.slugize

hexo.config.custom_sort = Object.assign({
    fields: hexo.config.custom_sort.fields,
    pathPage: hexo.config.custom_sort.pathPage || 'page',
    perPage: hexo.config.custom_sort.perPage || 20
}, hexo.config.custom_sort);



const last = {}

hexo.extend.generator.register('hexo-custom-sort', function (locals) {

    const allPosts = locals.posts;
    const parameters = hexo.config.custom_sort.fields
    const ItemPosts = {}
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



    allPosts.forEach(post => {
        parameters.forEach(key => {
            if (typeof (post[key]) !== 'undefined') {
                if (typeof (post[key]) !== 'object') {
                    if (!Object.prototype.hasOwnProperty.call(ItemPosts, key)) {
                        ItemPosts[key] = []
                    }
                    if (!Object.prototype.hasOwnProperty.call(ItemPosts[key], post[key])) {
                        ItemPosts[key][post[key]] = [];
                    }
                    ItemPosts[key][post[key]].push(post)
                } else {
                    post[key].forEach(coll => {
                        if (!Object.prototype.hasOwnProperty.call(ItemPosts, key)) {
                            ItemPosts[key] = []
                        }
                        if (!Object.prototype.hasOwnProperty.call(ItemPosts[key], coll)) {
                            ItemPosts[key][coll] = [];
                        }
                        ItemPosts[key][coll].push(post)
                    })
                }

            }
        })
    })
    const Query = this.model('Post').Query;
    for (const [name, arr] of Object.entries(ItemPosts)) {
        for (const [key, value] of Object.entries(arr)) {
            if (!value.length) continue;
            generate(slugize(key), new Query(value), { key: key });
        }
    }

    const keys = Object.keys(ItemPosts)

    keys.forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(last, key)) {
            last[key] = []
        }
        Object.keys(ItemPosts[key]).forEach(subkey => {
            last[key].push({
                name: subkey,
                path: slugize(subkey)
            })
        })

    })





    return result;


});

hexo.extend.filter.register('template_locals', function (locals) {
    Object.keys(last).forEach(key => {
        locals.site[key] = last[key]
    })
    return locals;
});


