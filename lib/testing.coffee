TestingView = require './testing-view'
{CompositeDisposable} = require 'atom'

module.exports = Testing =
  testingView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @testingView = new TestingView(state.testingViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @testingView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'testing:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @testingView.destroy()

  serialize: ->
    testingViewState: @testingView.serialize()

  toggle: ->
    console.log 'Testing was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
