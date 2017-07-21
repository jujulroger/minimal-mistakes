---
layout: single
title:  "Le taux de chômage explique-t-il le vote Front National ?"
header:
  overlay_color: "#333"
date:   2017-07-05 12:22:43 +0200
categories: politique
tags: test carte france
---

<link rel="stylesheet" href="{{site.baseurl}}/assets/css/colorbrewer.css">
<link rel="stylesheet" href="{{site.baseurl}}/assets/css/scatterplot.css">

Le but est de comparer le taux de chômage par département et le vote Front National au deuxième tour de l'élection présidentielle de 2017.
<figure>
  <figcaption>Taux de chômage au 1er trimestre 2017</figcaption>
  <div  id = "example"></div>
</figure>
<figure>
  <figcaption>Vote Front National 2è tour présidentielles 2017</figcaption>
  <div id  = "example-2"></div>
</figure>

La corrélation entre les deux est la suivante

<figure>
  <figcaption>Corrélation entre chômage et vote Front National</figcaption>
  <div id  = "dispersion"></div>
</figure>

<div id="residuals-button-container"></div>

Le coefficient de corrélation est R = 0,4


Cette carte représente l'écart entre le vote pour le FN et celui prédit par le taux de chômage.
<figure>
  <figcaption>Écart entre vote Front National et taux de chômage</figcaption>
  <div id  = "example-3"></div>
</figure>




<script src="https://d3js.org/d3.v4.min.js"></script>
<script>
 var baseurl = '{{site.baseurl}}';
</script>
<script src="{{site.baseurl}}/assets/js/jquery-1.12.4.min.js">
</script>
<script src="{{site.baseurl}}/assets/js/carte-france.js">
</script>
<script src="{{site.baseurl}}/assets/js/tooltip.js">
</script>
<script src="{{site.baseurl}}/assets/js/scatterplot-residuals.js">
</script>
<script src="{{site.baseurl}}/assets/js/post_test_1.js">
</script>
