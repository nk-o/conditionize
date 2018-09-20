## Conditionize
jQuery plugin for forms conditions to show/hide controls depending on its values.

## [Demo](https://codepen.io/_nK/pen/jvdLKM)

## Getting Started

```html
<script src="conditionize/dist/conditionize.min.js"></script>
```

#### CDN
Link directly from [unpkg](https://unpkg.com/)
```html
<script src="https://unpkg.com/conditionize@1/dist/conditionize.min.js"></script>
```

## Set up your HTML
```html
<form class="my-form" action="#">
  <h1>Conditionize</h1>
  
  <input type="text" name="text-control" placeholder="Type 'magic'">
  
  <div data-cond="[name=text-control] == magic">Magically show when text control contains 'magic' word.</div>

  <select name="select-control">
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three. Wow, you will see the new control below...</option>
  </select>

  <label data-cond="[name=select-control] == 3">
    <input type="checkbox" name="checkbox-control">
    Is checked?
    <span data-cond="[name=checkbox-control] != true">Nope</span>
    <span data-cond="[name=checkbox-control]">Yep</span>
  </label>
  
  <div>
    <a href="https://github.com/nk-o/conditionize" data-cond="[name=select-control] == 3 && [name=checkbox-control] == true">GitHub</a>
  </div>
</form>
```

## Call the plugin

```javascript
$('.my-cond-form').conditionize({
    selector: '[data-cond]'
});
```

## Options
Name | Type | Default | Description
:--- | :--- | :------ | :----------
selector | string | `[data-cond]` | Condition blocks jQuery selector.
conditionAttr | string | `data-cond` | Condition atribute that will be checked.
checkDebounce | int | `150` | Debounce timeout for better performance.

## Events
Events used the same way as Options.

Name | Description
:--- | :----------
onInit | Called after init end.
onDestroy | Called after destroy.
onCheck | Called when check function ended work (available 2 arguments `[ $item, show ]`).
customToggle | Custom toggle for conditional blocks. You can define your own function to show/hide blocks.

Example of `customToggle` function:
```javascript
{
    customToggle: function( $item, show ) {
        if ( show ) {
            $item.show();
        } else {
            $item.hide();
        }
    }
}
```

## Methods
Name | Result | Description
:--- | :----- | :----------
destroy | - | Destroy Conditionize and set block as it was before plugin init.

### Call methods example
```javascript
$('.my-cond-form').conditionize('destroy');
```


## No conflict
If you already have ***jQuery.fn.conditionize***, you can rename the plugin.

```javascript
jQuery.fn.newConditionize = jQuery.fn.conditionize.noConflict();
```

## For Developers

### Installation
* Run `npm install` in the command line. Or if you need to update some dependencies, run `npm update`

### Building
* `npm run build` to run build

### Linting
* `npm run js-lint` to show eslint errors
* `npm run js-lint-fix` to automatically fix some of the eslint errors
