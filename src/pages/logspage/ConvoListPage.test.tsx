import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { LogQueryEvent } from "../../reducers/log";
import DateUtils from "../../utils/date";
import Interval from "../../utils/Interval";
import { dummyLogs, dummySources } from "../../utils/test";
import { ConvoListPage } from "./ConvoListPage";
import { DateFilter } from "./filters/ConvoFilters";
import { CompositeFilter } from "./filters/Filters";
import FilteredConvoList from "./list/FilterableConvoList";

chai.use(sinonChai);
const expect = chai.expect;

const iconStyle = {
    width: "100%",
    height: "100px"
};

const tooltip = "TestTooltip";

describe("ConvoListPage", function () {

    let source: Source;
    let logs: Log[];
    let nextPage: Log[];
    let baseConversations: ConversationList;
    let fullNextPageConvoersations: ConversationList;
    let getLogs: Sinon.SinonStub;
    let newPage: Sinon.SinonStub;
    let refresh: Sinon.SinonStub;
    let onItemClick: Sinon.SinonStub;
    let onIconClick: Sinon.SinonStub;

    before(function () {
        source = dummySources(1)[0];
        logs = dummyLogs(200);
        nextPage = dummyLogs(100);
        const both = logs.concat(nextPage);

        baseConversations = ConversationList.fromLogs(logs);
        fullNextPageConvoersations = ConversationList.fromLogs(logs);

        getLogs = sinon.stub().returns(Promise.resolve(logs));
        newPage = sinon.stub();
        newPage.onFirstCall().returns(Promise.resolve({ oldLogs: logs, newLogs: nextPage, total: both }))
            .onSecondCall().returns(Promise.resolve({ oldLogs: both, newLogs: [], total: both }));
        refresh = sinon.stub().returns(Promise.resolve({ oldLogs: logs, newLogs: nextPage, total: both }));

        onItemClick = sinon.stub();
        onIconClick = sinon.stub();
    });

    afterEach(function () {
        getLogs.reset();
        newPage.reset();
        refresh.reset();
        onItemClick.reset();
        onIconClick.reset();
    });

    describe("Renders", function () {

        let filter: CompositeFilter<Conversation>;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            filter = new CompositeFilter([]);
        });

        beforeEach(function () {
            wrapper = shallow(
                <ConvoListPage
                    source={source}
                    newPage={newPage}
                    refresh={refresh}
                    getLogs={getLogs}
                    onIconClick={onIconClick}
                    onItemClick={onItemClick}
                    filter={filter}
                    iconTooltip={tooltip}
                    iconStyle={iconStyle}
                />);
        });

        it("Tests the FilterableConvoList exists.", function () {
            expect(wrapper.find(FilteredConvoList)).to.have.length(1);
        });

        it("Tests the FilterableConvoList has the appropriate props.", function () {
            const listWrapper = wrapper.find(FilteredConvoList);
            expect(listWrapper).to.have.prop("filter", filter);
            expect(listWrapper).to.have.prop("iconTooltip", tooltip);
            expect(listWrapper.prop("iconStyle")).to.equal(iconStyle); // The have.prop method seems to be different.
        });

        it("Tests that the \"getLogs\" is called props recieved", function () {
            wrapper.setProps({ ...wrapper.props() });
            expect(getLogs).to.be.calledOnce;
        });

        describe("getLogs", function () {

            let dateFilter: DateFilter;

            before(function () {
                dateFilter = new DateFilter(DateUtils.daysAgo(5), DateUtils.daysAgo(2));
                filter = filter.copyAndAddOrReplace(dateFilter);
            });

            beforeEach(function () {
                wrapper = shallow(
                    <ConvoListPage
                        source={source}
                        newPage={newPage}
                        refresh={refresh}
                        getLogs={getLogs}
                        filter={filter}
                    />);

                // In the real world, "componentWillReceiveProps" is called, but not in Enzyme.
                return Promise.resolve(true).then(function () {
                    wrapper.setProps({ ...wrapper.props() });
                });
            });

            it("Tests that the LogQuery is correct when a DateFilter is applied.", function () {
                const logQuery: LogQuery = getLogs.args[0][0];

                expect(logQuery.startTime).to.equalDate(dateFilter.startDate);
                expect(logQuery.endTime).to.equalDate(dateFilter.endDate);
            });

            it("Tests that the \"getLogs\" is not called when source is undefined.", function () {
                wrapper.setProps({ ...wrapper.props(), ...{ source: undefined } });

                expect(getLogs).to.have.been.calledOnce; // Only the first time.
            });

            it("Tests that the logs are cleared when going from a source to an undefined source.", function () {
                wrapper.setProps({ ...wrapper.props(), ...{ source: undefined } });

                const listWrapper = wrapper.find(FilteredConvoList).at(0);

                expect(listWrapper.prop("conversations")).to.deep.equal([]);
            });

            it("Tests that the logs are not recovered when setting props with the same source.", function () {
                wrapper.setProps({ ...wrapper.props() });
                wrapper.setProps({ ...wrapper.props() });

                expect(getLogs).to.have.been.calledOnce;
            });

            it("Tests that the logs are gathered when finding a different source.", function () {
                const newSource = dummySources(2)[1]; // The second one will have a different ID than the first.

                wrapper.setProps({ ...wrapper.props(), ...{ source: newSource } });

                expect(getLogs).to.have.been.calledTwice;
            });
        });
    });

    describe("Actions", function () {
        let filter: CompositeFilter<Conversation>;
        let wrapper: ShallowWrapper<any, any>;
        let listWrapper: ShallowWrapper<any, any>;

        before(function () {
            filter = new CompositeFilter([]);
        });

        beforeEach(function () {
            wrapper = shallow(
                <ConvoListPage
                    source={source}
                    newPage={newPage}
                    refresh={refresh}
                    getLogs={getLogs}
                    onIconClick={onIconClick}
                    onItemClick={onItemClick}
                    filter={filter}
                />);

            wrapper.setProps({ ...wrapper.props() });

            listWrapper = wrapper.find(FilteredConvoList);
        });

        it("Tests that iconClick triggers an event", function () {
            listWrapper.simulate("iconClick", baseConversations[0]);

            expect(onIconClick).to.have.been.calledOnce;
            expect(onIconClick).to.have.been.calledWith(baseConversations[0]);
        });

        it("Tests that the itemClick triggers an event", function () {
            listWrapper.simulate("itemClick", baseConversations[0]);

            expect(onItemClick).to.have.been.calledOnce;
            expect(onItemClick).to.have.been.calledWith(baseConversations[0]);
        });
    });

    describe("Scrolling", function () {
        let dateFilter: DateFilter;
        let filter: CompositeFilter<Conversation>;
        let wrapper: ShallowWrapper<any, any>;
        let listWrapper: ShallowWrapper<any, any>;

        before(function () {
            dateFilter = new DateFilter(DateUtils.daysAgo(5), DateUtils.daysAgo(2));
            filter = new CompositeFilter([dateFilter]);
        });

        beforeEach(function () {
            wrapper = shallow(
                <ConvoListPage
                    source={source}
                    newPage={newPage}
                    refresh={refresh}
                    getLogs={getLogs}
                    onIconClick={onIconClick}
                    onItemClick={onItemClick}
                    filter={filter}
                />);

            wrapper.setProps({ ...wrapper.props() });

            listWrapper = wrapper.find(FilteredConvoList);
        });

        it("Tests that the scroll will query a next page.", function () {
            // Have to wait for the "getLogs" pass to finish so the state is updated.
            return Promise.resolve(true).then(function () {
                listWrapper.simulate("scroll", 0, 6, 10);

                expect(newPage).to.have.been.calledOnce;

                const queryEvent = newPage.args[0][0] as LogQueryEvent;
                const limit = newPage.args[0][1] as number;

                expect(limit).to.equal(50);
                expect(queryEvent.logs.length).to.equal(logs.length);
                expect(queryEvent.query.source).to.equal(source);
            });
        });

        it("Tests that the scroll will not query the next page if it's not within range", function () {
            listWrapper.simulate("scroll", 0, 3, 10);

            expect(newPage).to.have.not.been.called;
        });

        it("Tests that the scroll will not query the next page if it's already loading.", function () {
            wrapper.setProps({ ...wrapper.props(), ...{ isLoading: true } });

            listWrapper = wrapper.find(FilteredConvoList);
            listWrapper.simulate("scroll", 0, 6, 10);

            expect(newPage).to.have.not.been.called;
        });

        it("Tests that scroll will not query once end is reached", function () {
            // Promises each time so each new one will wait for the last.
            return Promise.resolve(true).then(function () {
                listWrapper.simulate("scroll", 0, 6, 10);
            }).then(function () {
                listWrapper.simulate("scroll", 0, 6, 10);
            }).then(function () {
                listWrapper.simulate("scroll", 0, 6, 10);
            }).then(function () {
                expect(newPage).to.have.been.calledTwice;
            });
        });
    });

    describe("Items filtered", function () {
        let dateFilter: DateFilter;
        let filter: CompositeFilter<Conversation>;
        let wrapper: ShallowWrapper<any, any>;
        let listWrapper: ShallowWrapper<any, any>;

        before(function () {
            dateFilter = new DateFilter(DateUtils.daysAgo(5), DateUtils.daysAgo(2));
            filter = new CompositeFilter([dateFilter]);
        });

        beforeEach(function () {
            wrapper = shallow(
                <ConvoListPage
                    source={source}
                    newPage={newPage}
                    refresh={refresh}
                    getLogs={getLogs}
                    onIconClick={onIconClick}
                    onItemClick={onItemClick}
                    filter={filter}
                />);

            wrapper.setProps({ ...wrapper.props() });

            listWrapper = wrapper.find(FilteredConvoList);
        });

        it("Tests the next page is called when max limit has not been reached.", function () {
            return Promise.resolve(true).then(function () {
                listWrapper.simulate("itemsFiltered", baseConversations.splice(0, 10));

                expect(newPage).to.have.been.calledOnce;
                const queryEvent = newPage.args[0][0] as LogQueryEvent;
                const limit = newPage.args[0][1] as number;

                expect(limit).to.equal(50);
                expect(queryEvent.logs).to.equal(logs);
                expect(queryEvent.query.source).to.equal(source);
            });
        });

        it("Tests the next page is not called when not within limit.", function () {
            listWrapper.simulate("itemsFiltered", baseConversations);

            expect(newPage).to.have.not.been.called;
        });

        it("Tests the next page is not called when loading is true.", function () {
            wrapper.setProps({ ...wrapper.props(), ...{ isLoading: true } });

            listWrapper = wrapper.find(FilteredConvoList);
            listWrapper.simulate("itemsFiltered", baseConversations.splice(0, baseConversations.length / 2));

            expect(newPage).to.have.not.been.called;
        });
    });

    describe("Tests the refreshing.", function () {

        let wrapper: ShallowWrapper<any, any>;
        let stubExecutor: StubExecutor;
        let intervalStub: Sinon.SinonStub;

        before(function () {
            intervalStub = sinon.stub(Interval, "newExecutor", (ms: number, callback: () => void): Interval.Executor => {
                return stubExecutor = new StubExecutor(ms, callback);
            });
        });

        beforeEach(function () {
            wrapper = shallow(
                <ConvoListPage
                    source={source}
                    newPage={newPage}
                    refresh={refresh}
                    getLogs={getLogs}
                    onIconClick={onIconClick}
                    onItemClick={onItemClick}
                    refreshOn={true}
                />);
        });

        afterEach(function () {
            stubExecutor.reset();
            intervalStub.reset();
        });

        after(function () {
            intervalStub.restore();
        });

        it("Tests there is a value and callback passed to the exectuor.", function () {
            expect(stubExecutor).to.exist;
            expect(stubExecutor.ms).to.be.greaterThan(0);
            expect(stubExecutor.callback).to.exist;
        });

        it("Tests the interval executor is ended when unmounted.", function () {
            wrapper.unmount();
            expect(stubExecutor.end).to.have.been.calledOnce;
        });

        it("Tests the callback when the executor executes the callback.", function () {
            stubExecutor.callback();
            expect(refresh).to.have.been.calledOnce;
        });
    });
});

class StubExecutor implements Interval.Executor {

    callback: () => void;
    ms: number;

    start: Sinon.SinonStub;
    end: Sinon.SinonStub;

    constructor(ms: number, callback: () => void) {
        this.callback = callback;
        this.ms = ms;
        this.start = sinon.stub();
        this.end = sinon.stub();
    }

    reset() {
        this.start.reset();
        this.end.reset();
    }
}