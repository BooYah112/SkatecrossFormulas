/**
 * @OnlyCurrentDoc
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Skatecross')
      .addItem('Qualification - Add Round', 'SX_AddRounds')
      .addItem('Qualifications - Finish', 'SX_sumQualifications')
      .addItem('Finals - Prepare Rounds', 'SX_prepareFinals')
      .addSeparator()
      .addItem('Reset Page', 'SX_Reset')
      .addToUi();
}
