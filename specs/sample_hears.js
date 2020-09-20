const {BotMock, SlackApiMock} = require('botkit-mock');
const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware}= require('botbuilder-adapter-slack');
const should = require('should');
const dash = require('lodash');
const Controller = require('../features/sample_hears');

describe('sample hears',()=>{
  beforeEach(()=>{
    const adapter = new SlackAdapter(SlackApiMock.slackAdapterMockParams);
    adapter.use(new SlackEventMiddleware());
    adapter.use(new SlackMessageTypeMiddleware());

    this.controller = new BotMock({
      adapter: adapter,
      disable_webserver: true
    });

    SlackApiMock.bindMockApi(this.controller);
    Controller(this.controller);
  });

  const MESSAGE = {
    type:'message',
    user:'someUser',
    channel:'someChannel',
    messages:[]
  };

  it('should hear foo', async()=>{
    let MSG = dash.clone(MESSAGE);
    MSG.messages = [];
    MSG.messages.push({text:'foo',isAssertion:true});

    let message = await this.controller.usersInput([MSG]);

    return message.text.should.equal('I heard "foo" via a function test');
  });

  it('should hear a number', async()=>{
    let MSG = dash.clone(MESSAGE);
    MSG.messages = [];
    MSG.messages.push({text:'123',isAssertion:true});

    let message = await this.controller.usersInput([MSG]);

    return message.text.should.equal( 'I heard a number using a regular expression.');
  });

  it('should hear all caps', async()=>{
    let MSG = dash.clone(MESSAGE);
    MSG.messages = [];
    MSG.messages.push({text:'HELLO',isAssertion:true});

    let message = await this.controller.usersInput([MSG]);

    return message.text.should.equal( 'I HEARD ALL CAPS!');
  });

});
