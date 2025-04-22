const state = {
  memberStatisticsForm: {
    appId: '',
    platformId: '',
    startTime: '',
    endTime: ''
  },
  memberStatisticsTime: {
    time: 1,
    timeArr: ''
  },
  toMemberStatisticsNum: 0,
  appOverviewForm: {
    appId: '',
    platformId: '',
    startTime: '',
    endTime: ''
  },
  appOverViewTime: {
    time: 1,
    timeArr: ''
  },
  appOverviewNum: 0,
  retainedAnalysisForm: {
    appId: '',
    platformId: '',
    startTime: '',
    endTime: '',
    type: 1,
    anaType: 1
  },
  retainedAnalysisTime: {
    time: 1,
    timeArr: ''
  },
  retainedAnalysisNum: 0,
  retainedAnalysisFirst: {
    createBy: '',
    appId: ''
  },
  extensionAnalysisForm: {
    appId: '',
    platformId: '',
    startTime: '',
    endTime: ''
  },
  extensionAnalysisTime: {
    time: 1,
    timeArr: ''
  },
  extensionAnalysisNum: 0,
  ocpcAnalysisForm: {
    appId: '',
    platformType: '',
    appType: '',
    startTime: '',
    endTime: ''
  },
  ocpcAnalysisTime: {
    time: 1,
    timeArr: ''
  },
  ocpcAnalysisNum: 0
}

const mutations = {
  SET_MEMBER_STATISTICS: (state, data) => {
    state.memberStatisticsForm = data.memberStatisticsForm
    state.memberStatisticsTime = data.memberStatisticsTime
    state.toMemberStatisticsNum++
  },
  SET_APP_OVERVIEW: (state, data) => {
    state.appOverviewForm = data.appOverviewForm
    state.appOverViewTime = data.appOverViewTime
    state.appOverviewNum++
  },
  SET_RETAINED_ANALYSIS: (state, data) => {
    state.retainedAnalysisForm = data.retainedAnalysisForm
    state.retainedAnalysisTime = data.retainedAnalysisTime
    state.retainedAnalysisNum++
  },
  SET_RETAINED_EXTENSION: (state, data) => {
    state.extensionAnalysisForm = data.extensionAnalysisForm
    state.extensionAnalysisTime = data.extensionAnalysisTime
    state.extensionAnalysisNum++
  },
  SET_RETAINED_ANALYSIS_FIRST: (state, data) => {
    state.retainedAnalysisFirst = data
  },
  SET_RETAIEND_OCPC: (state, data) => {
    state.ocpcAnalysisForm = data.ocpcAnalysisForm
    state.ocpcAnalysisTime = data.ocpcAnalysisTime
    state.ocpcAnalysisNum++
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
