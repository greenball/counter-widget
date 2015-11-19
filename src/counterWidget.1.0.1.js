(function($, undefined) {

	/**
	 * Greenball/counterWidget published under MIT license.
	 * @package https://github.com/greenball/counterWidget
	 *
	 * Initialized CSS classes: ui-counterWidgetMain
	 * 
	 * Events: create, fStart, fStop, refresh, destroy
	 *
	 * @example  $('#healt-point').counterWidget({start: 1200, stop: 350, round: 0, interval: 3000, step: 100, text: '%counter% HP left!!!' });
	 * @example  $('#time-elapsed').counterWidget({start: 0, stop: 0, interval: 0, step: 1000 }); // simply count 1/s till gets killed.
	 */
	$.widget('ui.counterWidget', { 
		
		options: 		{
			// Start value count from where to where.
			start:		0,
			// Where counter trigger die if start and stop both setted to 0 will ran until get destroyed manualy.
			stop:		0,
			// The interval of the run time, 0 mean "infinity" till widget get killed.
			interval:	0,
			// Step units between start and stop value, if null then use automatic (not a good idea @@)
			step:		null,
			// The %counter% token will be replaced by the current value.
			text:		'%counter%',
			// Extend class(es) for counter.
			addClass:	'',
			// Direct roundering, on null will be automatic, 0 mean to floor, rest is precision like Math.round(1.2333, 2)
			round:		null,
		},
		
		/**
		 * Base math calculations then start.
		 */
		_create:			function() {
			// Set the infinity safe.
			this.options.interval	= this.options.interval ? this.options.interval : 86400000;

			// Different bettwen start and stop.
			this._different			= Math.abs(this.options.start - this.options.stop);
			
			// Infinity fix, when no precision given need a default.
			if ( ! this._different && ! this.options.step) {
				this.options.step = 10;
			}
			
			// Calculate precision, as 5000 long / 50 change = 100 milisec between steps
			if ( ! this.options.step) {
				this.options.step	= (this.options.interval / this._different);
			}
			
			// Change unit by every refresh, 5 / ( 1000 / 10 ) = 0.05
			this._change	 		= (this._different / (this.options.interval / this.options.step));
			this._current			= this.options.start;
			
			// Infinity fix, cuz at infinity the different is 0.
			if( ! this._change) {
				this._change			= this.options.step * 0.001;
			}
			
			// Calculate roundering.
			if( ! this.options.round) {
				this._round				= 4 - (this.options.step.toString().length);
				this._round				= (this._round < 0) ? 0 : this._round;
			}
			// Predefined roundering.
			else {
				this._round				= this.options.round;
			}

			// Add class(es).
			this.element.addClass(this.widgetBaseClass + 'Main ' + this.options.addClass);
			
			// Called at create.
			this._trigger('create', null, this);
			
			// Go for it !!!
			this.start();
			
			// Make it run once to start from step 0.
			this._html();
		},

		/**
		 * Start the counter, good for manual restarts.
		 *
		 * @example $('#progress').counterWidget('start');
		 */
		start:			function() {
			// Overload protection.
			if( ! this._func) {
				// Register stepper @.@
				this._func	= setInterval($.proxy(this._refresh, this), this.options.step);
				
				// Fire event
				this._trigger('fStart', null, this);
			}
		},
		
		/*
		 * Stop the counter.
		 *
		 * @example $('#progress').counterWidget('stop');
		 */
		stop:				function() {
			if (this._func) {
				// Deregister the stepper >.<
				clearInterval(this._func);

				// Clear the space.
				this._func 		= null;
				
				// Fire event.
				this._trigger('fStop', null, this);
			}
		},
		
		/*
		 * Get the current value.
		 *
		 * @example $('#progress-bar').counterWidget('value');
		 */
		value:		function() {
			return this._current;
		},
		
		/*
		 * Kill the widget and stop the timer.
		 *
		 * @example $('#dmg-bouble').counterWidget('destroy');
		 */
		destroy:	function() {
			// Remove classes.
			this.element.removeClass(this.widgetBaseClass+'Main '+this.options.addClass);
			
			// Stop the func.
			this.stop();
			
			// Remove the DOM.
			this.element.empty();
			
			// Call at the end to no to interferre.
			$.Widget.prototype.destroy.call(this);
			
			// Fire the event.
			this._trigger('destroy', null, this);
		},
		
		/*
		 * Update the target's value.
		 */
		_refresh:	function()
		{
			// Infinity loop.
			if ( ! (this.options.start + this.options.stop)) {
				this._current		+= this._change;
			}
			// Count up till a number.
			else if(this.options.start < this.options.stop) {
				this._current		+= this._change;
			}
			// Count down till a number.
			else if(this.options.start > this.options.stop) {
				this._current		-= this._change;
			}
			
			// Make it visible.
			this._html();

			// Reached the goal.
			if (this.options.start < this.options.stop) {
				if(this._current > this.options.stop) {
					return this.destroy();
				}
			} else if(this.options.start > this.options.stop) {
				if(this._current < this.options.stop) {
					return this.destroy();
				}
			}
		},
		
		/*
		 * Generates the HTML value for the counter.  
		 */
		_html:		function() {
			this.element.html(this.options.text.replace(/\%counter\%/, this._current.toFixed(this._round)));
			
			// Fire the event.
			this._trigger('refresh', null, this);
		},

	});
})($);