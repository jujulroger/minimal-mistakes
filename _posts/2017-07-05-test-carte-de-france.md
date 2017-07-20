---
layout: single
title:  "Test Carte de France"
header:
  overlay_color: "#333"
date:   2017-07-05 12:22:43 +0200
categories: politique
tags: test carte france
---

<link rel="stylesheet" href="{{site.baseurl}}/assets/css/colorbrewer.css">
<link rel="stylesheet" href="{{site.baseurl}}/assets/css/tooltip.css">

Le but est de comparer le taux de chômage par département et le vote Front National au deuxième tour de l'élection présidentielle de 2017.

<div style="overflow: hidden;">
    <div style="float: left;" id = "example"></div>
    <div  id  = "example-2"></div>
</div>

Cette carte représente l'écart entre le vote pour le FN et celui prédit par le taux de chômage.

<div  id  = "example-3"></div>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script>
 var baseurl = '{{site.baseurl}}';
</script>
<script src="{{site.baseurl}}/assets/js/jquery-1.12.4.min.js">
</script>
<script src="{{site.baseurl}}/assets/js/carte-france.js">
</script>
<script src="{{site.baseurl}}/assets/js/post_test_1.js">
</script>
