import * as chai from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
let jsdom = require("mocha-jsdom");

import ConversationList from "../../models/conversation-list";
import { dummyLogs } from "../../utils/test";
import ConversationListView, { ConversationListViewProps, ConversationListViewState } from "./ConversationListView";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("ConversationListView", function () {
    describe("with logs", function () {
        it("renders correctly", function () {
            let logs = dummyLogs(4);
            let conversations = ConversationList.fromLogs(logs);
            let onClick = sinon.spy();
            const wrapper = shallow(<ConversationListView conversations={conversations} onClick={onClick} />);

            expect(wrapper.find("ConversationListViewItem")).to.have.length(2);
            expect(wrapper.find("p")).to.have.length(0);
        });
    });
    describe("without logs", function () {
        it("renders correctly", function () {
            let onClick = sinon.spy();
            const wrapper = shallow(<ConversationListView conversations={[]} onClick={onClick} />);

            expect(wrapper.find("ConversationListViewItem")).to.have.length(0);
            expect(wrapper.find("p")).to.have.length(1);
        });
    });
    describe("property expandListItemWhenActive", function () {

        jsdom(); // required by enzyme mount, mocks the entire dom

        let logs = dummyLogs(4);
        let conversations = ConversationList.fromLogs(logs);

        let onClick: Sinon.SinonSpy;
        let wrapper: ReactWrapper<ConversationListViewProps, ConversationListViewState>;

        describe("when true", function () {

            beforeEach(function () {
                onClick = sinon.spy();

                wrapper = mount(
                    <ConversationListView
                        conversations={conversations}
                        onClick={onClick}
                        expandListItemWhenActive={true} />
                );

                expect(wrapper.find("ConversationListViewItem")).to.have.length(2);
                expect(wrapper.find("Interaction")).to.have.length(0);
            });

            it("renders interaction after clicking a list item", function () {

                let listItem = wrapper.find("li").first();
                listItem.simulate("click");
                expect(onClick).to.have.been.calledOnce;

                // Now we should find a Interaction present
                expect(wrapper.find("Interaction")).to.have.length(1);
            });
            it("clears the interaction when it is clicked again", function () {
                let listItem = wrapper.find("li").first();
                listItem.simulate("click");
                expect(onClick).to.have.been.calledOnce;
                listItem.simulate("click"); // click again to disable
                expect(onClick).to.have.callCount(2);
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
            it("renders two interactions after clicking on two list items", function () {
                let listItems = wrapper.find("li");
                let listItemOne = listItems.first();
                let listItemTwo = listItems.last();

                listItemOne.simulate("click");
                listItemTwo.simulate("click");

                expect(wrapper.find("Interaction")).to.have.length(2);
            });
        });
        describe("when false", function () {
            beforeEach(function () {
                onClick = sinon.spy();

                wrapper = mount(
                    <ConversationListView
                        conversations={conversations}
                        onClick={onClick} />
                );

                expect(wrapper.find("ConversationListViewItem")).to.have.length(2);
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
            it("does not render the interaction when clicked", function () {
                let listItem = wrapper.find("li").first();
                listItem.simulate("click");
                expect(onClick).to.have.been.calledOnce;

                // Now we should find a Interaction present
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
        });
    });
});