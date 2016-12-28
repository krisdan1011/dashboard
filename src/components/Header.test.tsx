import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Header } from "./Header";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Header", function () {
    it("renders correctly", function () {
        const wrapper = shallow(<Header />);
        expect(wrapper.find("header")).to.have.length(1);
    });

    describe("with title", function () {
        it("renders correctly", function () {
            const wrapper = shallow(<Header items={[{ label: "name", value: "id" }]} />);
            expect(wrapper.find("span").text()).to.have.equal("title");
            expect(wrapper.find("Select")).to.have.length(0);
        });
    });

    describe("with multiple titles", function () {
        it("renders correctly", function () {
            const wrapper = shallow(<Header items={[{ label: "name", value: "id" }, { label: "name1", value: "id1" }, { label: "name2", value: "id2" }, { label: "name3", value: "id3" }]} />);
            expect(wrapper.find("span")).to.have.length(0);
            // There should be a munu which lists the titles.
            expect(wrapper.find("Select")).to.have.length(1);
        });

        it("tests that the titles are selectable", function () {
            const items = [{ label: "name", value: "id" }, { label: "name1", value: "id1" }, { label: "name2", value: "id2" }, { label: "name3", value: "id3" }];
            const onItemSelected = sinon.spy();
            const wrapper = shallow(<Header items={items} onItemSelected={onItemSelected} />);
            let select = wrapper.find("Select");

            select.simulate("selected", "title1", 0);
            select.simulate("selected", "title2", 1);
            select.simulate("selected", "title3", 2);
            select.simulate("selected", "title4", 3);
            select.simulate("selected", "title5", 4);

            expect(onItemSelected).to.have.callCount(5);
            expect(onItemSelected).to.be.calledWithExactly(0);
            expect(onItemSelected).to.be.calledWithExactly(1);
            expect(onItemSelected).to.be.calledWithExactly(2);
            expect(onItemSelected).to.be.calledWithExactly(3);
            expect(onItemSelected).to.be.calledWithExactly(4);
        });

        it("tests the selectd index", function () {
            const items = [{ label: "name", value: "id" }, { label: "name1", value: "id1" }, { label: "name2", value: "id2" }, { label: "name3", value: "id3" }];
            const onItemSelected = sinon.spy();
            const wrapper = shallow(<Header items={items} onItemSelected={onItemSelected} selectedIndex={2} />);
            let select = wrapper.find("Select");

            expect((select.props() as any).defaultIndex).to.equal(2);
        });
    });
});