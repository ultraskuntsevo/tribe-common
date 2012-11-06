<?php
/**
 * Week Grid Template
 * The template for displaying events by week.
 *
 * This view contains the filters required to create an effective week grid view.
 *
 * You can recreate an ENTIRELY new week grid view by doing a template override, and placing
 * a week.php file in a tribe-events/pro/ directory within your theme directory, which
 * will override the /views/week.php. 
 *
 * You can use any or all filters included in this file or create your own filters in 
 * your functions.php. In order to modify or extend a single filter, please see our
 * readme on templates hooks and filters (TO-DO)
 *
 * @package TribeEventsCalendarPro
 * @since  2.1
 * @author Modern Tribe Inc.
 *
 */

if ( !defined('ABSPATH') ) { die('-1'); }

echo apply_filters( 'tribe_events_week_before_template', '');

	echo apply_filters( 'tribe_events_week_the_title', '');

    // weekly header (navigation)
	echo apply_filters( 'tribe_events_week_the_header', '');

	echo apply_filters( 'tribe_events_week_the_grid', '');

echo apply_filters( 'tribe_events_week_after_template', '');
