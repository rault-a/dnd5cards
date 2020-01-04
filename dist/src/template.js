"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = `<!doctype html>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css?family=Engagement&display=swap" rel="stylesheet">
<style>
  @page { margin: 1.5cm; }
  body { --margin: 1.6cm; width: calc(29.7cm - var(--margin) * 2); height: calc(21cm - var(--margin) * 2); }
  * { margin: 0; padding: 0; font-family: 'Engagement', cursive; }
  .list { list-style: none; display: grid; grid-template-columns: repeat(4, 6.1706cm); grid-template-rows: repeat(2, 8.5919cm); margin: 0.1cm; }
  .list img { width: 100%; height: calc(100% - 50px); object-fit: cover; object-position: 50% 0; }
  .list.gray img { filter: grayscale(100%); }
  .list p { height: 50px; text-align: center; line-height: 20px; font-size: 15pt; }
  .list p.name { font-weight: bold; }
  .list.debug { outline: 1px solid black; }
  .list.debug img { border: 1px solid black; }
  .list li { outline: 1px solid black; padding: 5px; }
  .pagebreak { page-break-before: always; }
</style>
<ul class="list"><% for (const { name, role, img } of characters) { %>
  <li><img src="<%= img %>"><p><%= name %><br><%= role %></p></li>
<% } %></ul>`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBYSxRQUFBLFFBQVEsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzthQW1CWCxDQUFDIn0=