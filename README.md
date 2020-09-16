# hexo-custom-sort
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

param.name = Name no slugize
param.path = slugize path

Example:
_config.yml
```
custom_sort:
  params: [collection]

```
_particle/menu.js
```
<% site.collection.forEach(coll=>{ %>
    <a href="/<%= coll.path %>"><%= coll.name %></a> 
<%})%>

```