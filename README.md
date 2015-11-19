# Greenball counterWidget

jQuery UI counterWidget

```js
// Examples.
$('#healt-point').counterWidget({start: 1200, stop: 350, round: 0, interval: 3000, step: 100, text: '%counter% HP left!!!' });
$('#earned').counterWidget({start: 0, stop: 244, interval: 1000, step: 100, text: '%counter% XP has been added!' });
$('#account').counterWidget({start: -800, stop: 5000, interval: 5000, step: 100, text: 'Your accounts balance is %counter% zen.' });
$('#time-elapsed').counterWidget({start: 0, stop: 0, interval: 0, step: 1000 }); // simply count 1/s till gets killed.
}});
```
