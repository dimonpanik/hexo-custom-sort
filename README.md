# hexo-custom-sort
[![Downloads](https://img.shields.io/npm/dm/hexo-custom-sort.svg)](https://www.npmjs.com/package/hexo-custom-sort) [![npm](https://img.shields.io/npm/v/hexo-custom-sort.svg)](https://www.npmjs.com/package/hexo-custom-sort) [![LICENSE](https://img.shields.io/npm/l/hexo-custom-sort.svg)](LICENSE)

Plugin helps to sort posts by required fields 
## Usage

**in _config.yml**
```
custom_sort:
  params: [one,two]
  pathPage: 'optional'
  perPage: 'optional'

```
All selected parameters will be moved to locals
```
param.name = Name no slugize
param.path = slugize path
```
**Example:**
_config.yml
```
custom_sort:
  params: [collection]

```
_partial/menu.js
```
<% site.collection.forEach(coll=>{ %>
    <a href="/<%= coll.path %>"><%= coll.name %></a> 
<%})%>

```
