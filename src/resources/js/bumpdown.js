(function( $, _ ) {
	'use strict';
	// Configure on Document ready for the default trigger
	$( document ).ready( function() {
		$( '.tribe-bumpdown-trigger' ).bumpdown();
	} );

	$.fn.bumpdown = function() {
		var $document = $( document ),
			selectors = {
				// A template for the ID if we don't have one already
				ID: 'tribe-bumpdown-',
				data_trigger: function( ID ) {
					return '[data-trigger="' + ID + '"]';
				},
				bumpdown: '.tribe-bumpdown',
				trigger: '.tribe-bumpdown-trigger',
				close: '.tribe-bumpdown-close',
				permanent: '.tribe-bumpdown-permanent',
				active: '.tribe-active'
			},
			methods = {
				open: function() {
					var $bumpdown = $( this ),
						data      = $bumpdown.data( 'bumpdown' ),
						arrow;

					if ( $bumpdown.is( ':visible' ) ) {
						return;
					}

					// Adds a Class to signal it's active
					data.$trigger.addClass( selectors.active.replace( '.', '' ) );
					arrow = data.$trigger.position().left - ( 'block' === data.type ? data.$parent.offset().left : 0 );

					$bumpdown.prepend( '<a class="tribe-bumpdown-close" title="Close"><i class="dashicons dashicons-no"></i></a>' );
					$bumpdown.prepend( '<span class="tribe-bumpdown-arrow" style="left: ' + arrow + 'px;"></span>' );
					$bumpdown.slideDown( 'fast' );
				},
				close: function() {
					var $bumpdown = $( this ),
						data      = $bumpdown.data( 'bumpdown' );

					if ( ! $bumpdown.is( ':visible' ) ) {
						return;
					}

					// When we close we reset the flag about hoverintent
					$( this ).removeData( 'is_hoverintent_queued' );

					$bumpdown.find( '.tribe-bumpdown-close, .tribe-bumpdown-arrow' ).remove()
					$bumpdown.slideUp( 'fast' );

					data.$trigger.removeClass( selectors.active.replace( '.', '' ) );
				}
			};

		$document
			// Use hoverIntent to make sure we are not opening Bumpdown on a fast hover
			.hoverIntent( {
				over: function() {
					var data = $( this ).data( 'bumpdown' );
					// Flags that it's open
					data.$trigger.data( 'is_hoverintent_queued', false );

					// Actually opens
					data.$bumpdown.trigger( 'open.bumpdown' );
				},
				out: function() {}, // Prevents Notice on JS
				selector: selectors.trigger,
				interval: 200
			} )

			// Setup Events on Trigger
			.on( {
				mouseenter: function() {
					if ( $( this ).data( 'is_hoverintent_queued' ) === undefined ) {
						// Flags that hoverIntent will take care of the
						$( this ).data( 'is_hoverintent_queued', true );
					}
				},
				click: function( e ) {
					var data = $( this ).data( 'bumpdown' );
					e.preventDefault();
					e.stopPropagation();

					if ( data.$bumpdown.is( ':visible' ) ) {
						// Makes sure we are not dealing with the first enter of the mouse
						if ( data.$trigger.data( 'is_hoverintent_queued' ) ) {
							// On double click it will close, kinda like forcing the closing
							return data.$trigger.data( 'is_hoverintent_queued', false );
						}

						data.$bumpdown.trigger( 'close.bumpdown' );
					} else {
						data.$bumpdown.trigger( 'open.bumpdown' );
					}
				},
				'open.bumpdown': methods.open,
				'close.bumpdown': methods.close
			}, selectors.trigger )

			// Setup Events on Trigger
			.on( {
				click: function( e ) {
					var data = $( this ).parents( selectors.bumpdown ).first().data( 'bumpdown' );
					e.preventDefault();
					e.stopPropagation();

					data.$bumpdown.trigger( 'close.bumpdown' );
				},
			}, selectors.close )

			// Triggers closing when clicking on the document
			.on( 'click', function( e ) {
				var $target = $( e.target ),
					is_bumpdown = $target.is( selectors.bumpdown ) || 0 !== $target.parents( selectors.bumpdown ).length;

				if ( is_bumpdown ) {
					return;
				}

				$( selectors.trigger ).not( selectors.permanent ).trigger( 'close.bumpdown' );
			} )

			// Creates actions on the actual bumpdown
			.on( {
				'open.bumpdown': methods.open,
				'close.bumpdown': methods.close
			}, selectors.bumpdown );

		// Configure all the fields
		return this.each( function() {
			var data = {
					// Store the jQuery Elements
					$trigger: $( this ),
					$parent: null,
					$bumpdown: null,

					// Store other Variables
					ID: null,
					html: null,
					type: 'block',

					// Flags
					is_permanent: false
				};

			// We need a ID for this Bumpdown
			data.ID = data.$trigger.attr( 'id' );

			// If we currently don't have the ID, set it up
			if ( ! data.ID ) {
				data.ID = _.uniqueId( selectors.ID );

				// Apply the given ID to
				data.$trigger.attr( 'id', data.ID );
			}

			// We fetch from `[data-bumpdown]` attr the possible HTML for this Bumpdown
			data.html = data.$trigger.data( 'bumpdown' );

			// Flags about if this bumpdown is permanent, meaning it only closes when clicking on the close button or the trigger
			data.is_permanent = data.$trigger.is( selectors.permanent );

			// Fetch the first Block-Level parent
			data.$parent = data.$trigger.parents().filter( function() {
				return $.inArray( $( this ).css( 'display' ), [ 'block', 'table', 'table-cell', 'table-row' ] );
			}).first();

			if ( ! data.html ) {
				data.$bumpdown = $( selectors.data_trigger( data.ID ) );
				data.type = 'block';
			} else {
				data.type = data.$parent.is( 'td, tr, td, table' ) ? 'table' : 'block';

				if ( 'table' === data.type ) {
					data.$bumpdown = $( '<td>' ).attr( { colspan: 2 } ).addClass( 'tribe-bumpdown-cell' ).html( data.html );
					var $row = $( '<tr>' ).append( data.$bumpdown ).addClass( 'tribe-bumpdown-row' );

					data.$parent = data.$trigger.parents( 'tr' ).first();

					data.$parent.after( $row );
				} else {
					data.$bumpdown = $( '<div>' ).addClass( 'tribe-bumpdown-block' ).html( data.html );
					data.$trigger.after( data.$bumpdown );
				}
			}

			// Setup data on trigger
			data.$trigger
				.data( 'bumpdown', data )

				// Mark this as the trigger
				.addClass( selectors.trigger.replace( '.', '' ) );


			// Setup data on actual bumpdown
			data.$bumpdown
				.data( 'bumpdown', data )

				// Mark it as the Bumpdown
				.addClass( selectors.bumpdown.replace( '.', '' ) );
		});
	};
}( jQuery, _ ) );