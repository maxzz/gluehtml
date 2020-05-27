
https://jsfiddle.net/tiagomatosweb/vqtnpyzw/ <- started with
https://www.vuemastery.com/blog/vue-3-start-using-it-today/

TODO: Firefox is grabbing credentials when value is changed (has -> clear)

```js
[...$0.children].map((_) => _.value)

// activated only when somebody asked
    computed: {
        allData: function() {
            let q = this.opt_hasUsername;
            let s = JSON.stringify(this.$data);
            console.log(s + q);
        }
    },

```
