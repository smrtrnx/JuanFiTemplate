=== JUANFI WIFI SYSTEM - MIKROTIK HOTSPOT TEMPLATE DOCUMENTATION ===

Description: 
JuanFi Hotspot Template is a minimal Bootstrap theme built and design for JuanFi Wifi system using mikrtotik routers. It features your current wifi credits such as time left, extend time, insert coin and login and logout to wifi network. JuanFi Wifi system Mikrotik hotspot template is Responsive theme built in Bootstrap 5 framework.

Contributors: smrtrnx
Tags: Juanfi, HotspotTemplate, Mikrotik

Requires mikrotik routers and Juanfi Wifi System
Tested on: mikrotik haplite and mikrotik hex 

Stable tag: 1.1.0
License: GNU General Public License v2 or later
License URI: LICENSE

A mikrotik hotspot template built for Juanfi Wifi system

== Description ==

Description


== COPYRIGHT AND LICENSE == 

JuanFi Mikrotik Hotspot Template, Copyright 2021 smrtrnx.

Juanfi Mikrotik Hotspot Template is distributed under the terms of the GNU GPL

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

== INSTALLATION ==

Please read the whole installation process before doing so.

NOTE: 

THE RISK IS YOURS, I suggest that you create a backup copy of your recent settings.

SYSTEM REQUIREMENT:

Mikrotik Hex and Haplite or any Mikrotik which supports MicroSD for hosting the theme files.

1. Login to Mikrotik Router using winbox
2. Go to Files
3. Drag and Drop the dist folder 
   (If your router supports MicroSD save the dist files in the MicroSD Card) 
   (Example: Disk1/)
4. Go to Mikrotik IP > Hotspot > Server Profiles > hsprof1
5. Change the HTML Directory to dist
   (If you have save the theme files in MicroSD Card Disk1, then select Disk1/dist)

6. Modify the the bundle.min.js 
   - Open the bundle.min.js with your specified text editor
   - Press CTRL+F and paste vendoIp:
   - Change the vendoIp: accordingly that matches the IP Address of your ESP8266
   - You can check your ESP8266 IP ADDRESS by going to Mikrotik > IP > DHCP SERVER > LEASES, using winbox or webfig
   - Save and upload the bundle.min.js to dist/assets/js directory in your Mikrotik Files which you have uploaded on STEP 3.

== Frequently Asked Questions ==

= Does this theme support any plugins? (No)

== Credits ==

* JuanFi https://github.com/ivanalayan15/JuanFi, ivanalayan15/JuanFi is licensed under the Apache License 2.0 [https://github.com/ivanalayan15/JuanFi/blob/master/LICENSE]

* smrtrnx https://github.com/smrtrnx/JuanFiTemplate, Designer / Frontend Developer is licensed under GNU GENERAL PUBLIC LICENSE

* normalize.css https://necolas.github.io/normalize.css/, (C) 2012-2016 Nicolas Gallagher and Jonathan Neal, [MIT](https://opensource.org/licenses/MIT)

* Bootstrap 5 by twitter is Licensed under the MIT License. https://github.com/twbs/bootstrap/blob/master/LICENSE.

* material-design-iconic-font.min.css by Material Design Iconic Font is Licensed under the MIT License. http://zavoloklom.github.io/material-design-iconic-font/license.html

* jquery.min.js OpenJS Foundation and JQuery https://openjsf.org/, JQuery License https://jquery.org/license/  
