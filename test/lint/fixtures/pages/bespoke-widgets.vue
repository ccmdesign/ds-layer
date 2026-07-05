<!-- FIXTURE (must FAIL ccm/no-bespoke-widgets): raw widget elements Nuxt UI already owns. -->
<template>
  <div>
    <button type="button">Save</button>
    <input type="text">
    <select>
      <option>One</option>
    </select>
    <table>
      <tr><td>cell</td></tr>
    </table>
    <dialog open>
      <p>Bespoke modal</p>
    </dialog>
  </div>
</template>
