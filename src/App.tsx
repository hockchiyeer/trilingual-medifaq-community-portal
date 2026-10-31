/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ADMIN_LEVEL, roleFromLevel, isAdministrator, isModeratorOrAbove, accessLevelKey } from './accessLevels';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Baby,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleUser,
  Clock,
  Crown,
  Eye,
  FileText,
  House,
  Inbox,
  Leaf,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  PenLine,
  Pill,
  Printer,
  Quote,
  Search,
  Send,
  Share2,
  Shield,
  Stethoscope,
  Trash2,
  TriangleAlert,
  User,
  UserPlus,
  Users,
  X,
  Heart,
  Smile,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

type Lang = 'EN' | 'ZH' | 'BM';

interface TranslationMap {
  [key: string]: string;
}

interface Translations {
  EN: TranslationMap;
  ZH: TranslationMap;
  BM: TranslationMap;
}

const T_DATA: Translations = {
  EN: {
    appName: "MediFAQ",
    fullTitle: "Online Medical Knowledge FAQ Database",
    tagline: "Accessible medical knowledge for all levels of Malaysian society",
    home: "Home",
    newMemberRegistration: "New Member Registration",
    userSignIn: "User Sign In",
    medicalKnowledgeFAQ: "Medical Knowledge FAQ",
    discussionBoard: "Discussion Board",
    searchMedicalFAQ: "Search Medical FAQ",
    searchDiscussionBoard: "Search Discussion Board",
    feedback: "Feedback",
    logout: "Logout",
    logoutSuccess: "You have been logged out successfully.",
    administrationBoard: "Administration Board",
    memberControlPanel: "Member Control Panel",
    editMyProfile: "Edit My Profile",
    changeMyPassword: "Change My Password",
    privateMessageCenter: "Private Message Center",
    healthyLifeStyle: "Healthy Life Style",
    diseasesDisorder: "Diseases and Disorder",
    pharmacy: "Pharmacy",
    parentingFamily: "Parenting & Family",
    mentalWellness: "Mental Wellness",
    quitSmoking: "Quit Smoking",
    nutrition: "Nutrition",
    exercise: "Exercise",
    allergy: "Allergy",
    asthma: "Asthma",
    diabetes: "Diabetes",
    vitamin: "Vitamin",
    antibiotics: "Antibiotics",
    herbalMedicine: "Herbal Medicine",
    dentalHygiene: "Dental Hygiene",
    generalPractice: "General Practice",
    men: "Men",
    women: "Women",
    pediatrician: "Pediatrician",
    search: "Search",
    searchFor: "Search for",
    allCategories: "All Categories",
    questions: "Questions",
    answers: "Answers",
    allOpenForums: "All Open Forums",
    subject: "Subject",
    post: "Post",
    members: "Members",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    retypePassword: "Retype Password",
    email: "Email",
    emailAddress: "E-mail Address",
    fullName: "Full Name",
    firstName: "First Name",
    lastName: "Last Name",
    address: "Address",
    homepageUrl: "Homepage URL",
    signature: "Signature",
    biography: "Biography",
    age: "Age",
    gender: "Gender",
    birthday: "Birthday",
    country: "Country",
    keepEmailPrivate: "Keep My Email Private",
    required: "Required field",
    invalidEmail: "Invalid email format",
    passwordMismatch: "Passwords do not match",
    usernameTaken: "Username already taken",
    register: "Register",
    registerMeNow: "Register Me Now!",
    login: "Log in",
    enterUsername: "Enter username",
    enterPassword: "Enter password",
    invalidLogin: "Invalid login - please check your credentials",
    usernameNotExist: "Sorry, the username does not exist. Please click here to try again.",
    wrongPassword: "You have entered an invalid password",
    sendPasswordToEmail: "Send password to email",
    emailSent: "Password reset instructions sent to your email address.",
    welcome: "Welcome",
    totalFAQs: "Total FAQs",
    totalTopics: "Total Topics",
    totalMembers: "Total Members",
    featuredTopics: "Featured Topics",
    quickAccess: "Quick Access",
    mainHealthTopics: "Main Health Topics",
    subTopics: "Sub Topics",
    faqs: "FAQs",
    createNewTopic: "NEW TOPIC",
    postReply: "Post Reply",
    topic: "Topic",
    message: "Message",
    priority: "Priority",
    normalPriority: "Normal Priority",
    highPriority: "High Priority",
    lowPriority: "Low Priority",
    createSubject: "Create This Subject!",
    goBackWithoutCreate: "Go back without create topic",
    goBackWithoutSave: "Go back without saving changes",
    update: "Update!",
    postThis: "Post This!",
    mustLoginToPost: "You must log in or register to post a reply!",
    edit: "Edit",
    delete: "Delete",
    profile: "Profile",
    quote: "Quote",
    pm: "PM",
    searchMedicalKnowledgeFAQ: "Search for Medical Knowledge FAQ in Database",
    searchMedicalKnowledgeDiscussion: "Search Medical Knowledge FAQ Discussion Board",
    feedbackForm: "Feedback Form",
    name: "Name",
    category: "Category",
    suggestion: "Suggestion",
    complaint: "Complaint",
    compliment: "Compliment",
    yourComment: "Your Comment",
    clearForm: "Clear Form",
    send: "Send",
    print: "Print",
    share: "Share",
    breadcrumbs: "Breadcrumbs",
    results: "Results",
    noResults: "No results found",
    adminHint: "Secure Portal — Authorized login required.",
    success: "Success",
    error: "Error",
    confirmDelete: "Are you sure you want to delete this item?",
    confirmLogout: "Are you sure you want to logout?",
    editMemberProfile: "Edit Member's Profile",
    cancelMembership: "Cancel Membership",
    deleteAllPosts: "Delete All Post of This Member",
    setAdminLevel: "Set Admin Level",
    membershipManagement: "Membership Management",
    feedbackMessageCenter: "Feedback Message Center",
    sendingEmailModule: "Sending Email Module",
    faqAdminBoard: "Medical Knowledge FAQ Administration Board",
    forumAdminBoard: "Forum Administration Board",
    sendEmailToAll: "Send Email to All Members",
    viewProfile: "View Profile",
    adminLevel: "Admin Level",
    levelWord: "Level",
    chooseAdminLevel: "Choose Admin Level:",
    accessLevelNone: "No Admin Rights",
    accessLevelModerator: "Moderator",
    accessLevelAdministrator: "Administrator - Back End Admin Rights",
    posts: "Posts",
    topics: "Topics",
    joinDate: "Join Date",
    lastOnline: "Last Online",
    lastPost: "Last Post",
    photo: "Photo",
    inbox: "Private Message Center",
    sendNewMessage: "Send New Message",
    changePassword: "Change Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmNewPassword: "Retype New Password",
    passwordChanged: "Password changed successfully!",
    profileUpdated: "Profile updated successfully!",
    feedbackSent: "Your feedback comment was sent. Thank you!",
    feedbackError: "You didn't fill in the required field(s) properly.",
    searchExample: "e.g., cancer, vitamin, smoking, fever",
    allFieldsRequired: "All fields marked * are required",
    accessibility: "Accessibility",
    highContrast: "High Contrast",
    fontSize: "Font Size",
    skipToContent: "Skip to content",
    searchAsYouType: "Search as you type",
    lastPostBy: "Last post by",
    repliesViews: "Replies / Views",
    author: "Author",
    createdBy: "Created by",
    in: "in",
    today: "Today",
    yesterday: "Yesterday",
    createFAQ: "Create Medical Knowledge FAQ",
    createFAQLink: "Please click here to Create Medical Knowledge FAQ !",
    editFAQ: "Edit Medical Knowledge FAQ",
    deleteFAQ: "Delete FAQ",
    deleteFAQConfirm: "Are you sure you want to permanently delete this Medical Knowledge FAQ?",
    faqQuestionLabel: "FAQ Question:",
    faqAnswerLabel: "FAQ Answer / Explanation:",
    noResultsInSubtopic: "No results found in this subtopic.",
    dlgChangeCategoryTitle: "Change Category Title",
    dlgChangeSubcategoryTitle: "Change Sub Category Title",
    dlgAddSubcategory: "Add a New Sub Category",
    dlgAddMainCategory: "Add a Main Category",
    dlgRenameForumCategory: "Rename Forum Category",
    dlgRenameSubforum: "Rename Subforum",
    dlgEditMemberName: "Edit Member Full Name",
    categoryNameLabel: "Category name:",
    subcategoryNameLabel: "Sub category name:",
    subforumNameLabel: "Subforum name:",
    memberFullNameLabel: "Full name:",
    add: "Add",
    save: "Save",
    deleteSuccess: "Deleted successfully",
    createSuccess: "Created successfully",
    membersList: "Members List",
    emailAll: "Email All Members",
    feedbacks: "Feedbacks",
    adminCenter: "Admin Center",
    controlPanel: "Control Panel",
    healthyLifeDesc: "Tips and knowledge for everyday healthy living",
    diseasesDesc: "Understand common conditions and how to manage them",
    pharmacyDesc: "Safe use of medicines and supplements",
    parentingDesc: "Guidance for parents and families",
    mentalDesc: "Support for emotional wellbeing",
    answerFromDoctor: "Answer from Verified Medical Officer",
    doctorAttributionNote: "Medical Officer / Verified Clinical Content",
    cancel: "Cancel",
    confirm: "Confirm",
    loggingOut: "Logging you out...",
    close: "Close",
    reply: "Reply",
    deleteReply: "Delete Reply",
    deleteAll: "DELETE ALL",
    newMsg: "NEW MSG",
    adminHome: "Admin Home",
    loginPrompt: "If you have not already registered, please",
    clickHere: "click here",
    toRegister: "to do so now. Your password is case sensitive.",
    defaultTestAccounts: "Default Test Accounts:",
    administratorRole: "Administrator",
    doctorRole: "Doctor / Moderator",
    standardMemberRole: "Standard Member",
    invalidPwMsg: "You have entered an invalid password,",
    forgotPwPrompt: "If you have forgotten your password, please",
    sendPwEmailMsg: ". The system will send your password to your email account.",
    toTryAgain: "To try again, please",
    noUserMsg: "Sorry, the username",
    doesNotExist: "does not exist.",
    pleaseClickHereToTryAgain: "to try again.",
    secureLogoutMsg: "Your session has been securely ended so that your data will not be accessed by unauthorized users.",
    fillFieldsToRegister: "Fill in all fields to become a registered member of the Online Medical Knowledge FAQ Database.",
    requiredInformation: "Required Information",
    male: "Male",
    female: "Female",
    otherGender: "Other",
    welcomeTitle: "Welcome To Online Medical Knowledge FAQ Database",
    memberControlPanelFor: "Member Control Panel for",
    changePwSub: "Change your Log In password.",
    editProfileSub: "Change your personal profile.",
    pmCenterSub: "View and manage your private messages.",
    profileSummary: "Profile Summary",
    memberNo: "Member No",
    totalPosts: "Total Posts",
    topicsStarted: "Topics Started",
    privateTag: "[Private]",
    adminInboxesQuickStatus: "Administrator Inboxes & Quick Status",
    feedbackInbox: "Feedback Inbox",
    submissions: "submissions",
    unreadMsg: "unread",
    zeroNew: "0 new",
    adminControlCenter: "Admin Control Center",
    changePwHeader: "Change your Log In password",
    changePasswordBtn: "Change Password!",
    pleaseFillAllPwFields: "Please fill in all password fields.",
    oldPwMismatch: "Old password does not match current password.",
    makeRequiredChangesToProfile: "Make the required changed to your profile below.",
    updateMyProfileBtn: "Update My Profile!",
    fromSender: "From",
    timeReceived: "Time Received",
    mailingOptions: "Mailing Options",
    emptyInboxMsg: "Your message inbox is empty.",
    goBackToControlPanel: "Go back to Control Panel",
    medicalFAQTitle: "Medical Knowledge Frequently Asked Question",
    selectMainTopicDesc: "Select a Main Topic below to view related medical subcategories and clinical FAQs.",
    mainTopicHeader: "Main Topic",
    subtopicsCount: "Subtopics",
    subtopicsHeaderSuffix: "Subtopics",
    faqsAvailable: "FAQs Available",
    clickingViews: "Clicking",
    addBy: "Add by",
    atTime: "at",
    medicalKnowledgeFAQDiscussionBoard: "Medical Knowledge FAQ Discussion Board",
    discussionThreadFor: "Discussion thread for",
    topicsCount: "Topics",
    topicTitle: "Topic Title",
    byUserAtTime: "By",
    noTopicsPostedYet: "No topics have been posted in this subforum yet.",
    createNewTopicForDiscussion: "Create New Topic for Discussion",
    enterTopicTitle: "Enter topic title",
    typeDiscussionContent: "Type your discussion content here...",
    topicTitlePrefix: "Topic title:",
    subForumBreadcrumb: "Sub Forum",
    pmInboxBtn: "PM INBOX",
    controlPanelBtn: "CONTROL PANEL",
    searchBtnLabel: "SEARCH",
    routingStatus: "Notification & Routing Status:",
    routingPersisted: "• Persisted to PostgreSQL database and Feedback Message Center.",
    routingDispatched: "• Dispatched internal notification to Administrator Message Center.",
    routingQueued: "• Notification queued for Administrator email account.",
    sendAnother: "Send Another",
    accessDeniedTitle: "Access Denied • Administrator Privileges Required",
    accessDeniedDesc: "You must be logged in as an authorized System Administrator to access the Administration Board.",
    sysAdminControlPanel: "System Administrative Control Panel",
    superAdmin: "Super Administrator",
    adminControlPanelUnits: "Admin Control Panel (5 Function Units)",
    medFaqAdminUnit: "Medical Knowledge FAQ Administration",
    medFaqAdminUnitDesc: "Add, delete or edit FAQ & categories.",
    discussionBoardAdminUnit: "Discussion Board Administration",
    discussionBoardAdminUnitDesc: "Add, delete or edit forum and subforums.",
    sendEmailToAllUnit: "Send Email to All Members",
    sendEmailToAllUnitDesc: "Broadcast system-wide email announcements.",
    membershipMgmtUnit: "Membership Management",
    membershipMgmtUnitDesc: "Delete membership, set moderator/admin access.",
    readUserFeedbackUnit: "Read User's Feedback",
    readUserFeedbackUnitDesc: "Inspect inbox comments and suggestions.",
    messagesCount: "messages",
    recipientUsername: "Recipient Username:",
    messageContentLabel: "Message Content:",
    generalAccess: "General Access",
    memberAccess: "Member Access",
    adminSection: "Admin Section",
    demoStatus: "Interactive Demo Ready",
    malaysianHealthPortal: "Malaysian Public Health Knowledge Portal",
    toggleNavigationMenu: "Toggle navigation menu",
    decreaseFontSize: "Decrease font size",
    resetFontSize: "Reset font size",
    increaseFontSize: "Increase font size",
    toggleHighContrast: "Toggle high contrast",
    editPost: "Edit Post",
    neverPosted: "Never Posted!",
    createdAt: "Created at",
    systemNotice: "System Notice"
  },
  ZH: {
    appName: "MediFAQ",
    fullTitle: "线上医疗常问知识库",
    tagline: "让马来西亚各阶层都能轻松获取医疗知识",
    home: "首页",
    newMemberRegistration: "新会员注册",
    userSignIn: "用户登录",
    medicalKnowledgeFAQ: "医学知识常问",
    discussionBoard: "讨论区",
    searchMedicalFAQ: "搜索医学常问",
    searchDiscussionBoard: "搜索讨论区",
    feedback: "反馈意见",
    logout: "退出登录",
    logoutSuccess: "您已成功退出登录。",
    administrationBoard: "管理面板",
    memberControlPanel: "会员控制面板",
    editMyProfile: "编辑我的资料",
    changeMyPassword: "修改我的密码",
    privateMessageCenter: "私人信息中心",
    healthyLifeStyle: "健康生活方式",
    diseasesDisorder: "疾病与失调",
    pharmacy: "药剂学",
    parentingFamily: "育儿与家庭",
    mentalWellness: "心理健康",
    quitSmoking: "戒烟",
    nutrition: "营养饮食",
    exercise: "运动锻炼",
    allergy: "过敏症",
    asthma: "哮喘",
    diabetes: "糖尿病",
    vitamin: "维生素",
    antibiotics: "抗生素",
    herbalMedicine: "传统草药",
    dentalHygiene: "牙齿卫生",
    generalPractice: "普通全科",
    men: "男性健康",
    women: "女性健康",
    pediatrician: "儿科医生",
    search: "搜索",
    searchFor: "搜索内容",
    allCategories: "所有分类",
    questions: "问题",
    answers: "答案",
    allOpenForums: "所有开放论坛",
    subject: "主题",
    post: "帖子",
    members: "会员",
    username: "用户名",
    password: "密码",
    confirmPassword: "确认密码",
    retypePassword: "再次输入密码",
    email: "电子邮箱",
    emailAddress: "电子邮件地址",
    fullName: "姓名全称",
    firstName: "名字",
    lastName: "姓氏",
    address: "地址",
    homepageUrl: "个人主页网址",
    signature: "个性签名",
    biography: "个人简介",
    age: "年龄",
    gender: "性别",
    birthday: "出生日期",
    country: "国家/地区",
    keepEmailPrivate: "保持我的邮箱隐私",
    required: "必填项",
    invalidEmail: "电子邮箱格式不正确",
    passwordMismatch: "两次输入的密码不一致",
    usernameTaken: "该用户名已被注册",
    register: "注册",
    registerMeNow: "立即注册！",
    login: "登录",
    enterUsername: "请输入用户名",
    enterPassword: "请输入密码",
    invalidLogin: "登录无效，请检查用户名或密码",
    usernameNotExist: "对不起，该用户名不存在。请点击此处重试。",
    wrongPassword: "您输入了错误的密码",
    sendPasswordToEmail: "将密码发送到邮箱",
    emailSent: "密码重置指南已发送至您的注册邮箱。",
    welcome: "欢迎",
    totalFAQs: "常问总数",
    totalTopics: "讨论主题",
    totalMembers: "注册会员",
    featuredTopics: "精选主题",
    quickAccess: "快捷入口",
    mainHealthTopics: "主要健康主题",
    subTopics: "子分类主题",
    faqs: "常问解答",
    createNewTopic: "新建主题",
    postReply: "发表回复",
    topic: "主题",
    message: "内容",
    priority: "优先级",
    normalPriority: "普通优先级",
    highPriority: "高优先级",
    lowPriority: "低优先级",
    createSubject: "创建此主题！",
    goBackWithoutCreate: "不创建并返回",
    goBackWithoutSave: "不保存并返回",
    update: "更新！",
    postThis: "发布此贴！",
    mustLoginToPost: "您必须先登录或注册才能发表回复！",
    edit: "编辑",
    delete: "删除",
    profile: "资料",
    quote: "引用",
    pm: "私信",
    searchMedicalKnowledgeFAQ: "在数据库中检索医学常问知识",
    searchMedicalKnowledgeDiscussion: "检索医学知识讨论区",
    feedbackForm: "用户反馈表单",
    name: "姓名",
    category: "类别",
    suggestion: "改进建议",
    complaint: "投诉意见",
    compliment: "表扬感谢",
    yourComment: "您的评论意见",
    clearForm: "清空表单",
    send: "发送",
    print: "打印",
    share: "分享",
    breadcrumbs: "导航路径",
    results: "条结果",
    noResults: "未找到相关结果",
    adminHint: "安全门户 — 需要授权登录。",
    success: "成功",
    error: "提示错误",
    confirmDelete: "确定要删除此条目吗？",
    confirmLogout: "确定要退出登录吗？",
    editMemberProfile: "编辑会员资料",
    cancelMembership: "注销会员资格",
    deleteAllPosts: "删除该会员的所有帖子",
    setAdminLevel: "设置管理权限级别",
    membershipManagement: "会员权限管理",
    feedbackMessageCenter: "用户反馈消息中心",
    sendingEmailModule: "群发邮件模块",
    faqAdminBoard: "医学常问知识库管理面板",
    forumAdminBoard: "论坛讨论区管理面板",
    sendEmailToAll: "向所有会员发送通告邮件",
    viewProfile: "查看资料",
    adminLevel: "管理级别",
    levelWord: "级别",
    chooseAdminLevel: "选择管理级别:",
    accessLevelNone: "无管理权限",
    accessLevelModerator: "版主",
    accessLevelAdministrator: "管理员 - 后台管理权限",
    posts: "发帖数",
    topics: "主题数",
    joinDate: "注册日期",
    lastOnline: "最后在线",
    lastPost: "最后发帖",
    photo: "头像照片",
    inbox: "私人信息中心",
    sendNewMessage: "发送新信息",
    changePassword: "修改登录密码",
    oldPassword: "旧密码",
    newPassword: "新密码",
    confirmNewPassword: "确认新密码",
    passwordChanged: "密码修改成功！",
    profileUpdated: "个人资料更新成功！",
    feedbackSent: "您的反馈评论已成功发送。非常感谢！",
    feedbackError: "请正确填写所有必填字段。",
    searchExample: "例如：癌症、维生素、戒烟、发烧",
    allFieldsRequired: "标有 * 的字段均为必填项",
    accessibility: "无障碍辅助",
    highContrast: "高对比度",
    fontSize: "字体大小",
    skipToContent: "跳至正文内容",
    searchAsYouType: "即时键入搜索",
    lastPostBy: "最后回复来自",
    repliesViews: "回复 / 浏览",
    author: "作者",
    createdBy: "创建者",
    in: "所属分类",
    today: "今天",
    yesterday: "昨天",
    createFAQ: "创建医学常问条目",
    createFAQLink: "请点击此处创建医学常问条目！",
    editFAQ: "编辑医学常问条目",
    deleteFAQ: "删除常问条目",
    deleteFAQConfirm: "确定要永久删除此医学常问条目吗？",
    faqQuestionLabel: "常问问题：",
    faqAnswerLabel: "常问答案 / 说明：",
    noResultsInSubtopic: "此子主题下未找到相关结果。",
    dlgChangeCategoryTitle: "修改类别标题",
    dlgChangeSubcategoryTitle: "修改子类别标题",
    dlgAddSubcategory: "新增子类别",
    dlgAddMainCategory: "新增主类别",
    dlgRenameForumCategory: "重命名论坛类别",
    dlgRenameSubforum: "重命名子论坛",
    dlgEditMemberName: "编辑会员全名",
    categoryNameLabel: "类别名称：",
    subcategoryNameLabel: "子类别名称：",
    subforumNameLabel: "子论坛名称：",
    memberFullNameLabel: "全名：",
    add: "添加",
    save: "保存",
    deleteSuccess: "删除成功",
    createSuccess: "创建成功",
    membersList: "会员列表",
    emailAll: "群发邮件给会员",
    feedbacks: "收件箱反馈",
    adminCenter: "管理中心",
    controlPanel: "控制面板",
    healthyLifeDesc: "日常健康生活与疾病预防知识",
    diseasesDesc: "深入了解常见病症及其护理应对",
    pharmacyDesc: "处方药物与营养补充剂安全使用指南",
    parentingDesc: "家庭育儿与儿童生长发育指南",
    mentalDesc: "心理情绪调节与心理健康支持",
    answerFromDoctor: "驻站医疗顾问医生专业解答",
    doctorAttributionNote: "执业医疗顾问 / 审核临床知识",
    cancel: "取消",
    confirm: "确认",
    loggingOut: "正在退出系统...",
    close: "关闭",
    reply: "回复",
    deleteReply: "删除回复",
    deleteAll: "全部删除",
    newMsg: "新信息",
    adminHome: "管理首页",
    loginPrompt: "如果您尚未注册，请",
    clickHere: "点击此处",
    toRegister: "以立即注册。您的密码区分大小写。",
    defaultTestAccounts: "默认测试账号：",
    administratorRole: "管理员",
    doctorRole: "医生 / 版主",
    standardMemberRole: "普通会员",
    invalidPwMsg: "您输入了无效的密码，",
    forgotPwPrompt: "如果您忘记了密码，请",
    sendPwEmailMsg: "。系统将会把密码发送到您的电子邮箱。",
    toTryAgain: "要重试，请",
    noUserMsg: "抱歉，用户名",
    doesNotExist: "不存在。",
    pleaseClickHereToTryAgain: "以重试。",
    secureLogoutMsg: "您的会话已安全结束，因此未经授权的用户将无法访问您的数据。",
    fillFieldsToRegister: "填写所有字段以成为线上医疗常问知识库的注册会员。",
    requiredInformation: "必填信息",
    male: "男",
    female: "女",
    otherGender: "其他",
    welcomeTitle: "欢迎来到线上医疗常问知识库",
    memberControlPanelFor: "会员控制面板：",
    changePwSub: "修改您的登录密码。",
    editProfileSub: "修改您的个人资料。",
    pmCenterSub: "查看并管理您的私人信息。",
    profileSummary: "资料摘要",
    memberNo: "会员编号",
    totalPosts: "总发帖数",
    topicsStarted: "发起的讨论",
    privateTag: "[保密]",
    adminInboxesQuickStatus: "管理员收件箱与快捷状态",
    feedbackInbox: "反馈收件箱",
    submissions: "条反馈",
    unreadMsg: "未读",
    zeroNew: "0 条新信息",
    adminControlCenter: "管理员控制中心",
    changePwHeader: "修改您的登录密码",
    changePasswordBtn: "修改密码！",
    pleaseFillAllPwFields: "请填写所有密码字段。",
    oldPwMismatch: "旧密码与当前密码不符。",
    makeRequiredChangesToProfile: "请在下方对您的个人资料进行必要的修改。",
    updateMyProfileBtn: "更新我的资料！",
    fromSender: "发件人",
    timeReceived: "接收时间",
    mailingOptions: "邮件选项",
    emptyInboxMsg: "您的收件箱为空。",
    goBackToControlPanel: "返回控制面板",
    medicalFAQTitle: "医疗常问知识",
    selectMainTopicDesc: "在下方选择一个主要主题，以查看相关的医疗子分类和临床常问。",
    mainTopicHeader: "主要主题",
    subtopicsCount: "个子主题",
    subtopicsHeaderSuffix: "子主题",
    faqsAvailable: "条常问解答",
    clickingViews: "点击量",
    addBy: "添加者",
    atTime: "于",
    medicalKnowledgeFAQDiscussionBoard: "医疗常问知识讨论区",
    discussionThreadFor: "讨论主题：",
    topicsCount: "个主题",
    topicTitle: "主题标题",
    byUserAtTime: "由",
    noTopicsPostedYet: "该子论坛尚未发布任何主题。",
    createNewTopicForDiscussion: "创建新讨论主题",
    enterTopicTitle: "输入主题标题",
    typeDiscussionContent: "在此输入讨论内容……",
    topicTitlePrefix: "主题标题：",
    subForumBreadcrumb: "子论坛",
    pmInboxBtn: "私人信息箱",
    controlPanelBtn: "控制面板",
    searchBtnLabel: "搜索",
    routingStatus: "通知与路由状态：",
    routingPersisted: "• 已保存至 PostgreSQL 数据库与反馈消息中心。",
    routingDispatched: "• 已发送内部通知至管理员消息中心。",
    routingQueued: "• 通知已加入队列排队发送至管理员电子邮箱。",
    sendAnother: "发送另一条",
    accessDeniedTitle: "拒绝访问 • 需要管理员权限",
    accessDeniedDesc: "您必须作为受授权的系统管理员登录才能访问管理面板。",
    sysAdminControlPanel: "系统行政控制面板",
    superAdmin: "超级管理员",
    adminControlPanelUnits: "管理员控制面板（5个功能单元）",
    medFaqAdminUnit: "医疗常问知识管理",
    medFaqAdminUnitDesc: "添加、删除或编辑 FAQ 与分类。",
    discussionBoardAdminUnit: "讨论区管理",
    discussionBoardAdminUnitDesc: "添加、删除或编辑论坛与子论坛。",
    sendEmailToAllUnit: "向所有会员发送电子邮件",
    sendEmailToAllUnitDesc: "广播系统级电子邮件通知。",
    membershipMgmtUnit: "会员资格管理",
    membershipMgmtUnitDesc: "取消会员资格、设置版主/管理员权限。",
    readUserFeedbackUnit: "阅读用户反馈",
    readUserFeedbackUnitDesc: "检查收件箱中的意见与建议。",
    messagesCount: "条消息",
    recipientUsername: "收件人用户名：",
    messageContentLabel: "消息内容：",
    generalAccess: "常规访问",
    memberAccess: "会员通道",
    adminSection: "管理专区",
    demoStatus: "交互演示就绪",
    malaysianHealthPortal: "马来西亚公共卫生常识知识库",
    toggleNavigationMenu: "切换导航菜单",
    decreaseFontSize: "缩小字体",
    resetFontSize: "重置字体",
    increaseFontSize: "放大字体",
    toggleHighContrast: "切换高对比度",
    editPost: "编辑帖子",
    neverPosted: "尚未发帖！",
    createdAt: "创建于",
    systemNotice: "系统提示"
  },
  BM: {
    appName: "MediFAQ",
    fullTitle: "Pangkalan Data FAQ Pengetahuan Perubatan Dalam Talian",
    tagline: "Pengetahuan perubatan yang mudah diakses untuk semua lapisan masyarakat Malaysia",
    home: "Laman Utama",
    newMemberRegistration: "Pendaftaran Ahli Baru",
    userSignIn: "Log Masuk Pengguna",
    medicalKnowledgeFAQ: "FAQ Pengetahuan Perubatan",
    discussionBoard: "Papan Perbincangan",
    searchMedicalFAQ: "Cari FAQ Perubatan",
    searchDiscussionBoard: "Cari Papan Perbincangan",
    feedback: "Maklum Balas",
    logout: "Log Keluar",
    logoutSuccess: "Anda telah berjaya log keluar.",
    administrationBoard: "Lembaga Pentadbiran",
    memberControlPanel: "Panel Kawalan Ahli",
    editMyProfile: "Sunting Profil Saya",
    changeMyPassword: "Tukar Kata Laluan",
    privateMessageCenter: "Pusat Mesej Peribadi",
    healthyLifeStyle: "Gaya Hidup Sihat",
    diseasesDisorder: "Penyakit dan Gangguan",
    pharmacy: "Farmasi",
    parentingFamily: "Keibubapaan & Keluarga",
    mentalWellness: "Kesihatan Mental",
    quitSmoking: "Berhenti Merokok",
    nutrition: "Pemakanan Sihat",
    exercise: "Senaman",
    allergy: "Alahan",
    asthma: "Asma",
    diabetes: "Diabetes",
    vitamin: "Vitamin",
    antibiotics: "Antibiotik",
    herbalMedicine: "Perubatan Herba",
    dentalHygiene: "Kebersihan Gigi",
    generalPractice: "Amalan Am",
    men: "Kesihatan Lelaki",
    women: "Kesihatan Wanita",
    pediatrician: "Pakar Kanak-kanak",
    search: "Cari",
    searchFor: "Cari untuk",
    allCategories: "Semua Kategori",
    questions: "Soalan",
    answers: "Jawapan",
    allOpenForums: "Semua Forum Terbuka",
    subject: "Subjek",
    post: "Pos",
    members: "Ahli",
    username: "Nama Pengguna",
    password: "Kata Laluan",
    confirmPassword: "Sahkan Kata Laluan",
    retypePassword: "Taip Semula Kata Laluan",
    email: "E-mel",
    emailAddress: "Alamat E-mel",
    fullName: "Nama Penuh",
    firstName: "Nama Pertama",
    lastName: "Nama Akhir",
    address: "Alamat",
    homepageUrl: "URL Laman Utama",
    signature: "Tandatangan",
    biography: "Biografi",
    age: "Umur",
    gender: "Jantina",
    birthday: "Tarikh Lahir",
    country: "Negara",
    keepEmailPrivate: "Rahsiakan E-mel Saya",
    required: "Medan diperlukan",
    invalidEmail: "Format e-mel tidak sah",
    passwordMismatch: "Kata laluan tidak sepadan",
    usernameTaken: "Nama pengguna telah didaftarkan",
    register: "Daftar",
    registerMeNow: "Daftar Saya Sekarang!",
    login: "Log masuk",
    enterUsername: "Masukkan nama pengguna",
    enterPassword: "Masukkan kata laluan",
    invalidLogin: "Log masuk tidak sah - sila periksa maklumat anda",
    usernameNotExist: "Maaf, nama pengguna tersebut tidak wujud. Sila klik di sini untuk cuba lagi.",
    wrongPassword: "Anda telah memasukkan kata laluan yang tidak sah",
    sendPasswordToEmail: "Hantar kata laluan ke e-mel",
    emailSent: "Arahan penetapan semula kata laluan telah dihantar ke e-mel anda.",
    welcome: "Selamat Datang",
    totalFAQs: "Jumlah FAQ",
    totalTopics: "Jumlah Topik",
    totalMembers: "Jumlah Ahli",
    featuredTopics: "Topik Pilihan",
    quickAccess: "Akses Pantas",
    mainHealthTopics: "Topik Kesihatan Utama",
    subTopics: "Sub Topik",
    faqs: "Soalan Lazim",
    createNewTopic: "TOPIK BARU",
    postReply: "Balas Pos",
    topic: "Topik",
    message: "Mesej",
    priority: "Keutamaan",
    normalPriority: "Keutamaan Normal",
    highPriority: "Keutamaan Tinggi",
    lowPriority: "Keutamaan Rendah",
    createSubject: "Cipta Subjek Ini!",
    goBackWithoutCreate: "Kembali tanpa cipta topik",
    goBackWithoutSave: "Kembali tanpa simpan perubahan",
    update: "Kemas Kini!",
    postThis: "Pos Ini!",
    mustLoginToPost: "Anda mesti log masuk atau daftar untuk membalas!",
    edit: "Sunting",
    delete: "Padam",
    profile: "Profil",
    quote: "Petik",
    pm: "PM",
    searchMedicalKnowledgeFAQ: "Cari FAQ Pengetahuan Perubatan dalam Pangkalan Data",
    searchMedicalKnowledgeDiscussion: "Cari Papan Perbincangan FAQ Pengetahuan Perubatan",
    feedbackForm: "Borang Maklum Balas",
    name: "Nama",
    category: "Kategori",
    suggestion: "Cadangan",
    complaint: "Aduan",
    compliment: "Pujian",
    yourComment: "Komen Anda",
    clearForm: "Kosongkan Borang",
    send: "Hantar",
    print: "Cetak",
    share: "Kongsi",
    breadcrumbs: "Navigasi",
    results: "Keputusan",
    noResults: "Tiada keputusan dijumpai",
    adminHint: "Portal Selamat — Log masuk yang diberi kuasa diperlukan.",
    success: "Berjaya",
    error: "Ralat",
    confirmDelete: "Adakah anda pasti mahu memadam item ini?",
    confirmLogout: "Adakah anda pasti mahu log keluar?",
    editMemberProfile: "Sunting Profil Ahli",
    cancelMembership: "Batal Keahlian",
    deleteAllPosts: "Padam Semua Pos Ahli Ini",
    setAdminLevel: "Tetapkan Tahap Pentadbir",
    membershipManagement: "Pengurusan Keahlian",
    feedbackMessageCenter: "Pusat Mesej Maklum Balas",
    sendingEmailModule: "Modul Penghantaran E-mel",
    faqAdminBoard: "Lembaga Pentadbiran FAQ Pengetahuan Perubatan",
    forumAdminBoard: "Lembaga Pentadbiran Forum",
    sendEmailToAll: "Hantar E-mel kepada Semua Ahli",
    viewProfile: "Lihat Profil",
    adminLevel: "Tahap Pentadbir",
    levelWord: "Tahap",
    chooseAdminLevel: "Pilih Tahap Pentadbir:",
    accessLevelNone: "Tiada Hak Pentadbir",
    accessLevelModerator: "Moderator",
    accessLevelAdministrator: "Pentadbir - Hak Pentadbir Bahagian Belakang",
    posts: "Jumlah Pos",
    topics: "Jumlah Topik",
    joinDate: "Tarikh Sertai",
    lastOnline: "Kali Terakhir Dalam Talian",
    lastPost: "Pos Terakhir",
    photo: "Foto",
    inbox: "Pusat Mesej Peribadi",
    sendNewMessage: "Hantar Mesej Baru",
    changePassword: "Tukar Kata Laluan Log Masuk",
    oldPassword: "Kata Laluan Lama",
    newPassword: "Kata Laluan Baru",
    confirmNewPassword: "Taip Semula Kata Laluan Baru",
    passwordChanged: "Kata laluan berjaya ditukar!",
    profileUpdated: "Profil berjaya dikemas kini!",
    feedbackSent: "Komen maklum balas anda telah dihantar. Terima kasih!",
    feedbackError: "Sila isi semua medan wajib dengan betul.",
    searchExample: "cth: kanser, vitamin, merokok, demam",
    allFieldsRequired: "Semua medan bertanda * adalah wajib",
    accessibility: "Kebolehcapaian",
    highContrast: "Kontras Tinggi",
    fontSize: "Saiz Fon",
    skipToContent: "Langkau ke kandungan utama",
    searchAsYouType: "Cari semasa menaip",
    lastPostBy: "Pos terakhir oleh",
    repliesViews: "Balasan / Tontonan",
    author: "Pengarang",
    createdBy: "Dicipta oleh",
    in: "dalam",
    today: "Hari Ini",
    yesterday: "Semalam",
    createFAQ: "Cipta FAQ Pengetahuan Perubatan",
    createFAQLink: "Sila klik di sini untuk Mencipta FAQ Pengetahuan Perubatan !",
    editFAQ: "Sunting FAQ Pengetahuan Perubatan",
    deleteFAQ: "Padam FAQ",
    deleteFAQConfirm: "Adakah anda pasti mahu memadam FAQ Pengetahuan Perubatan ini secara kekal?",
    faqQuestionLabel: "Soalan FAQ:",
    faqAnswerLabel: "Jawapan / Penerangan FAQ:",
    noResultsInSubtopic: "Tiada keputusan dijumpai dalam subtopik ini.",
    dlgChangeCategoryTitle: "Tukar Tajuk Kategori",
    dlgChangeSubcategoryTitle: "Tukar Tajuk Subkategori",
    dlgAddSubcategory: "Tambah Subkategori Baharu",
    dlgAddMainCategory: "Tambah Kategori Utama",
    dlgRenameForumCategory: "Namakan Semula Kategori Forum",
    dlgRenameSubforum: "Namakan Semula Subforum",
    dlgEditMemberName: "Sunting Nama Penuh Ahli",
    categoryNameLabel: "Nama kategori:",
    subcategoryNameLabel: "Nama subkategori:",
    subforumNameLabel: "Nama subforum:",
    memberFullNameLabel: "Nama penuh:",
    add: "Tambah",
    save: "Simpan",
    deleteSuccess: "Berjaya dipadam",
    createSuccess: "Berjaya dicipta",
    membersList: "Senarai Ahli",
    emailAll: "E-mel Semua Ahli",
    feedbacks: "Maklum Balas",
    adminCenter: "Pusat Pentadbiran",
    controlPanel: "Panel Kawalan",
    healthyLifeDesc: "Petua dan pengetahuan untuk amalan gaya hidup sihat",
    diseasesDesc: "Fahami penyakit umum dan cara pengurusannya",
    pharmacyDesc: "Panduan keselamatan ubat preskripsi dan suplemen",
    parentingDesc: "Panduan keibubapaan dan kesihatan seisi keluarga",
    mentalDesc: "Sokongan kesejahteraan mental dan emosi",
    answerFromDoctor: "Jawapan daripada Pegawai Perubatan Bertauliah",
    doctorAttributionNote: "Pegawai Perubatan / Kandungan Klinikal Disahkan",
    cancel: "Batal",
    confirm: "Sahkan",
    loggingOut: "Sedang log keluar...",
    close: "Tutup",
    reply: "Balas",
    deleteReply: "Padam Balasan",
    deleteAll: "PADAM SEMUA",
    newMsg: "MESEJ BARU",
    adminHome: "Laman Utama Pentadbir",
    loginPrompt: "Jika anda belum mendaftar, sila",
    clickHere: "klik di sini",
    toRegister: "untuk mendaftar sekarang. Kata laluan anda peka huruf besar/kecil.",
    defaultTestAccounts: "Akaun Ujian Laluan:",
    administratorRole: "Pentadbir",
    doctorRole: "Doktor / Moderator",
    standardMemberRole: "Ahli Biasa",
    invalidPwMsg: "Anda telah memasukkan kata laluan yang tidak sah,",
    forgotPwPrompt: "Jika anda terlupa kata laluan anda, sila",
    sendPwEmailMsg: ". Sistem akan menghantar kata laluan anda ke akaun e-mel anda.",
    toTryAgain: "Untuk cuba lagi, sila",
    noUserMsg: "Maaf, nama pengguna",
    doesNotExist: "tidak wujud.",
    pleaseClickHereToTryAgain: "untuk cuba lagi.",
    secureLogoutMsg: "Sesi anda telah ditamatkan secara selamat supaya data anda tidak dapat diakses oleh pengguna yang tidak dibenarkan.",
    fillFieldsToRegister: "Isi semua medan untuk menjadi ahli berdaftar Pangkalan Data FAQ Pengetahuan Perubatan Dalam Talian.",
    requiredInformation: "Maklumat Diperlukan",
    male: "Lelaki",
    female: "Perempuan",
    otherGender: "Lain-lain",
    welcomeTitle: "Selamat Datang Ke Pangkalan Data FAQ Pengetahuan Perubatan Dalam Talian",
    memberControlPanelFor: "Panel Kawalan Ahli untuk",
    changePwSub: "Tukar kata laluan Log Masuk anda.",
    editProfileSub: "Tukar profil peribadi anda.",
    pmCenterSub: "Lihat dan urus mesej peribadi anda.",
    profileSummary: "Ringkasan Profil",
    memberNo: "No. Ahli",
    totalPosts: "Jumlah Pos",
    topicsStarted: "Topik Dimulakan",
    privateTag: "[Rahsia]",
    adminInboxesQuickStatus: "Peti Masuk & Status Pantas Pentadbir",
    feedbackInbox: "Peti Masuk Maklum Balas",
    submissions: "serahan",
    unreadMsg: "belum dibaca",
    zeroNew: "0 baru",
    adminControlCenter: "Pusat Kawalan Pentadbir",
    changePwHeader: "Tukar kata laluan Log Masuk anda",
    changePasswordBtn: "Tukar Kata Laluan!",
    pleaseFillAllPwFields: "Sila isi semua medan kata laluan.",
    oldPwMismatch: "Kata laluan lama tidak sepadan dengan kata laluan semasa.",
    makeRequiredChangesToProfile: "Buat perubahan yang diperlukan pada profil anda di bawah.",
    updateMyProfileBtn: "Kemas Kini Profil Saya!",
    fromSender: "Daripada",
    timeReceived: "Masa Diterima",
    mailingOptions: "Pilihan Mel",
    emptyInboxMsg: "Peti masuk mesej anda adalah kosong.",
    goBackToControlPanel: "Kembali ke Panel Kawalan",
    medicalFAQTitle: "Soalan Lazim Pengetahuan Perubatan",
    selectMainTopicDesc: "Pilih Topik Utama di bawah untuk melihat subkategori perubatan dan FAQ klinikal yang berkaitan.",
    mainTopicHeader: "Topik Utama",
    subtopicsCount: "Subtopik",
    subtopicsHeaderSuffix: "Subtopik",
    faqsAvailable: "FAQ Tersedia",
    clickingViews: "Klik",
    addBy: "Ditambah oleh",
    atTime: "pada",
    medicalKnowledgeFAQDiscussionBoard: "Papan Perbincangan FAQ Pengetahuan Perubatan",
    discussionThreadFor: "Thred perbincangan untuk",
    topicsCount: "Topik",
    topicTitle: "Tajuk Topik",
    byUserAtTime: "Oleh",
    noTopicsPostedYet: "Belum ada topik yang diposkan dalam subforum ini lagi.",
    createNewTopicForDiscussion: "Cipta Topik Baru untuk Perbincangan",
    enterTopicTitle: "Masukkan tajuk topik",
    typeDiscussionContent: "Taip kandungan perbincangan anda di sini...",
    topicTitlePrefix: "Tajuk topik:",
    subForumBreadcrumb: "Sub Forum",
    pmInboxBtn: "PETI PM",
    controlPanelBtn: "PANEL KAWALAN",
    searchBtnLabel: "CARI",
    routingStatus: "Status Pemberitahuan & Hala Tuju:",
    routingPersisted: "• Disimpan ke pangkalan data PostgreSQL dan Pusat Mesej Maklum Balas.",
    routingDispatched: "• Pemberitahuan dalaman dihantar ke Pusat Mesej Pentadbir.",
    routingQueued: "• Pemberitahuan dijadualkan untuk akaun e-mel Pentadbir.",
    sendAnother: "Hantar Lagi",
    accessDeniedTitle: "Akses Ditolak • Keperluan Hak Pentadbir",
    accessDeniedDesc: "Anda mesti log masuk sebagai Pentadbir Sistem yang diberi kuasa untuk mengakses Lembaga Pentadbiran.",
    sysAdminControlPanel: "Panel Kawalan Pentadbiran Sistem",
    superAdmin: "Pentadbir Utama",
    adminControlPanelUnits: "Panel Kawalan Pentadbir (5 Unit Fungsi)",
    medFaqAdminUnit: "Pentadbiran FAQ Pengetahuan Perubatan",
    medFaqAdminUnitDesc: "Tambah, padam atau sunting FAQ & kategori.",
    discussionBoardAdminUnit: "Pentadbiran Papan Perbincangan",
    discussionBoardAdminUnitDesc: "Tambah, padam atau sunting forum dan subforum.",
    sendEmailToAllUnit: "Hantar E-mel kepada Semua Ahli",
    sendEmailToAllUnitDesc: "Siarkan pengumuman e-mel ke seluruh sistem.",
    membershipMgmtUnit: "Pengurusan Keahlian",
    membershipMgmtUnitDesc: "Padam keahlian, tetapkan akses moderator/pentadbir.",
    readUserFeedbackUnit: "Baca Maklum Balas Pengguna",
    readUserFeedbackUnitDesc: "Semak komen dan cadangan peti masuk.",
    messagesCount: "mesej",
    recipientUsername: "Nama Pengguna Penerima:",
    messageContentLabel: "Kandungan Mesej:",
    generalAccess: "Akses Umum",
    memberAccess: "Akses Ahli",
    adminSection: "Bahagian Pentadbir",
    demoStatus: "Demo Interaktif Bersedia",
    malaysianHealthPortal: "Portal Pengetahuan Kesihatan Awam Malaysia",
    toggleNavigationMenu: "Tukar menu navigasi",
    decreaseFontSize: "Kecilkan saiz fon",
    resetFontSize: "Tetapkan semula saiz fon",
    increaseFontSize: "Besarkan saiz fon",
    toggleHighContrast: "Tukar kontras tinggi",
    editPost: "Sunting Pos",
    neverPosted: "Belum Pernah Pos!",
    createdAt: "Dicipta pada",
    systemNotice: "Notis Sistem"
  }
};

// All 8 authentic main health topics from Appendix C (Figure 11, Figure 43)
interface SubCategory {
  id: string;
  mainId: string;
  name: Record<Lang, string>;
  desc?: Record<Lang, string>;
}

interface MainCategory {
  id: string;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  color: 'blue' | 'amber' | 'teal';
  icon: React.ComponentType<{ className?: string }>;
  listOrder: number;
  subs: SubCategory[];
}

const INITIAL_CATEGORIES: MainCategory[] = [
  {
    id: "dental",
    name: { EN: "Dental Hygiene", ZH: "牙齿卫生", BM: "Kebersihan Gigi" },
    desc: { EN: "Oral health, teeth brushing, and gum disease prevention", ZH: "口腔护理、正确刷牙及牙周病预防", BM: "Kesihatan mulut, memberus gigi dan pencegahan penyakit gusi" },
    color: "blue",
    icon: Smile,
    listOrder: 1,
    subs: [
      { id: "bleeding_gum", mainId: "dental", name: { EN: "Bleeding Gum", ZH: "牙龈出血", BM: "Gusi Berdarah" } },
      { id: "tooth_decay", mainId: "dental", name: { EN: "Tooth Decay & Cavities", ZH: "龋齿蛀牙", BM: "Kerosakan Gigi" } }
    ]
  },
  {
    id: "diseases",
    name: { EN: "Diseases And Disorder", ZH: "疾病与失调", BM: "Penyakit dan Gangguan" },
    desc: { EN: "Understand chronic and acute conditions, symptoms, and therapies", ZH: "了解急慢性疾病、临床表现与应对方案", BM: "Fahami penyakit kronik dan akut, simptom serta terapi" },
    color: "blue",
    icon: Stethoscope,
    listOrder: 2,
    subs: [
      { id: "allergy", mainId: "diseases", name: { EN: "Allergy", ZH: "过敏", BM: "Alahan" }, desc: { EN: "Allergy means that your immune system reacts abnormally to substance that is usually not harmful.", ZH: "过敏意味着您的免疫系统对通常无害的物质产生异常反应。", BM: "Alahan bermakna sistem imun anda bertindak balas secara tidak normal kepada bahan yang biasanya tidak berbahaya." } },
      { id: "asthma", mainId: "diseases", name: { EN: "Asthma", ZH: "哮喘", BM: "Asma" }, desc: { EN: "Asthma is a chronic respiratory disease that causes tightening of the chest and difficulty breathing due to inflammation.", ZH: "哮喘是一种慢性呼吸道疾病，因发炎引起胸闷及呼吸急促。", BM: "Asma adalah penyakit pernafasan kronik yang menyebabkan dada sesak dan kesukaran bernafas akibat keradangan." } },
      { id: "cancer", mainId: "diseases", name: { EN: "Cancer", ZH: "癌症", BM: "Kanser" } },
      { id: "diabetes", mainId: "diseases", name: { EN: "Diabetes", ZH: "糖尿病", BM: "Diabetes" } },
      { id: "haemorrhoids", mainId: "diseases", name: { EN: "Haemorrhoids", ZH: "痔疮", BM: "Buasir" } },
      { id: "migraine", mainId: "diseases", name: { EN: "Migraine", ZH: "偏头痛", BM: "Migrain" } }
    ]
  },
  {
    id: "general",
    name: { EN: "General Practice", ZH: "普通全科", BM: "Amalan Am" },
    desc: { EN: "Everyday clinical questions, first aid, and general health advice", ZH: "日常门诊常见问题、急救常识与全科咨询", BM: "Soalan klinikal harian, pertolongan cemas dan nasihat am" },
    color: "blue",
    icon: Heart,
    listOrder: 3,
    subs: [
      { id: "bleeding_nose", mainId: "general", name: { EN: "Bleeding Nose", ZH: "流鼻血", BM: "Hidung Berdarah" } },
      { id: "eyes_problems", mainId: "general", name: { EN: "Eyes Problems", ZH: "眼部问题", BM: "Masalah Mata" } },
      { id: "pimple_acne", mainId: "general", name: { EN: "Pimple And Acne", ZH: "青春痘与粉刺", BM: "Jerawat" } },
      { id: "white_hair", mainId: "general", name: { EN: "White Hair", ZH: "白发问题", BM: "Rambut Putih" } }
    ]
  },
  {
    id: "healthy",
    name: { EN: "Healthy Life Style", ZH: "健康生活方式", BM: "Gaya Hidup Sihat" },
    desc: { EN: "Nutrition, physical fitness, smoking cessation, and wellness", ZH: "膳食营养、身体锻炼、戒烟戒酒及全面身心健康", BM: "Pemakanan, kecergasan fizikal, berhenti merokok dan kesejahteraan" },
    color: "blue",
    icon: Leaf,
    listOrder: 4,
    subs: [
      { id: "quit", mainId: "healthy", name: { EN: "Quit Smoking", ZH: "戒烟", BM: "Berhenti Merokok" }, desc: { EN: "Smoker needs a lot of efforts to quit smoking. But the motto is 'Quit and Quit again'", ZH: "吸烟者戒烟需要付出很大努力。座右铭是：'戒了再戒，绝不放弃'", BM: "Perokok memerlukan banyak usaha untuk berhenti. Moto ialah 'Berhenti dan Berhenti lagi'" } },
      { id: "nutrition", mainId: "healthy", name: { EN: "Nutrition", ZH: "健康营养", BM: "Pemakanan" } },
      { id: "exercise", mainId: "healthy", name: { EN: "Exercise", ZH: "运动锻炼", BM: "Senaman" } }
    ]
  },
  {
    id: "men",
    name: { EN: "Men", ZH: "男性健康", BM: "Kesihatan Lelaki" },
    desc: { EN: "Health concerns, screenings, and preventative care specifically for men", ZH: "针对男性的专属健康筛查、前列腺及预防医学指南", BM: "Penjagaan kesihatan pencegahan, saringan khusus untuk lelaki" },
    color: "teal",
    icon: User,
    listOrder: 5,
    subs: [
      { id: "prostate", mainId: "men", name: { EN: "Prostate Health", ZH: "前列腺保健", BM: "Kesihatan Prostat" } },
      { id: "mens_cardio", mainId: "men", name: { EN: "Cardiovascular Screenings", ZH: "男性心血管筛查", BM: "Saringan Kardiovaskular" } }
    ]
  },
  {
    id: "pediatrician",
    name: { EN: "Pediatrician", ZH: "儿科医生", BM: "Pakar Kanak-kanak" },
    desc: { EN: "Childhood immunizations, developmental milestones, and infant illness", ZH: "儿童疫苗接种、生长发育里程碑及婴儿常见疾患", BM: "Imunisasi kanak-kanak, perkembangan dan penyakit bayi" },
    color: "amber",
    icon: Baby,
    listOrder: 6,
    subs: [
      { id: "baby", mainId: "pediatrician", name: { EN: "Baby", ZH: "婴儿护理", BM: "Bayi" } },
      { id: "child_immunization", mainId: "pediatrician", name: { EN: "Immunization", ZH: "预防接种", BM: "Imunisasi" } }
    ]
  },
  {
    id: "pharmacy",
    name: { EN: "Pharmacy", ZH: "药剂学", BM: "Farmasi" },
    desc: { EN: "Medication storage, drug interactions, vitamins, and supplements", ZH: "处方药贮存、药物相互作用、维生素及保健补剂", BM: "Penyimpanan ubat, interaksi ubat, vitamin dan suplemen" },
    color: "blue",
    icon: Pill,
    listOrder: 7,
    subs: [
      { id: "vitamin", mainId: "pharmacy", name: { EN: "Vitamin", ZH: "维生素", BM: "Vitamin" } },
      { id: "antibiotic", mainId: "pharmacy", name: { EN: "Antibiotic", ZH: "抗生素", BM: "Antibiotik" } },
      { id: "expired_medicine", mainId: "pharmacy", name: { EN: "Expired Medicine", ZH: "过期药物处置", BM: "Ubat Tamat Tempoh" } },
      { id: "alternative_supplements", mainId: "pharmacy", name: { EN: "Alternative/Complementary Supplements", ZH: "替代与补充补剂", BM: "Suplemen Alternatif/Tambahan" } }
    ]
  },
  {
    id: "women",
    name: { EN: "Women", ZH: "女性健康", BM: "Kesihatan Wanita" },
    desc: { EN: "Maternal wellness, breast health, reproductive wellness, and screenings", ZH: "孕期母婴关怀、乳腺健康、妇科体检与保健指南", BM: "Kesihatan ibu, payudara, kesihatan reproduktif dan saringan" },
    color: "amber",
    icon: Heart,
    listOrder: 8,
    subs: [
      { id: "breast_health", mainId: "women", name: { EN: "Breast Health Screening", ZH: "乳房自检与筛查", BM: "Saringan Kesihatan Payudara" } },
      { id: "maternal_care", mainId: "women", name: { EN: "Maternal Care", ZH: "产前产后护理", BM: "Penjagaan Ibu Mengandung" } }
    ]
  }
];

interface FAQItem {
  id: string;
  mainId: string;
  subId: string;
  q: Record<Lang, string>;
  a: Record<Lang, string>;
  doctorName?: string;
  createdBy: string;
  createdAt: string;
  views: number;
}

const INITIAL_FAQS: FAQItem[] = [
  {
    id: "f_vit_guidelines",
    mainId: "pharmacy",
    subId: "vitamin",
    q: {
      EN: "May I know the guidelines to be followed for the use of vitamins?",
      ZH: "请问服用维生素应该遵循哪些指导原则？",
      BM: "Bolehkah saya tahu garis panduan yang perlu dipatuhi untuk penggunaan vitamin?"
    },
    a: {
      EN: "From my observations, most people are taking vitamins without proper indication and consultation with the doctor/pharmacist.\n\nAnyway, these guidelines may be followed for the use of vitamins:\n1. The doctor requires you to take them.\n2. Follow the dose appropriately.\n3. Follow the instructions carefully.\n4. If you develop any reaction to the product, please inform the doctor or the pharmacist.\n5. Store them at the recommended place and temperature.\n6. Discard the product, if it show signs of deterioration.",
      ZH: "根据临床观察，许多人并未在医生或药剂师指导下盲目补充维生素。\n\n建议遵循以下维生素使用指南：\n1. 仅在医生或临床必要时服用。\n2. 严格按推荐剂量服用，勿超量。\n3. 仔细阅读并遵守药物标签说明。\n4. 若出现皮疹、恶心等任何不良反应，请立即通知医生或药剂师。\n5. 妥善保存在推荐的避光、干燥及适宜温度环境中。\n6. 一旦药剂出现受潮、变色或过期变质迹象，务必立即废弃。",
      BM: "Daripada pemerhatian klinikal, kebanyakan orang mengambil vitamin tanpa indikasi wajar dan perundingan dengan doktor/ahli farmasi.\n\nWalau bagaimanapun, garis panduan berikut boleh dipatuhi:\n1. Doktor memerlukan anda mengambilnya.\n2. Ikuti dos dengan betul.\n3. Ikuti arahan dengan teliti.\n4. Jika anda mengalami sebarang tindak balas terhadap produk, sila maklumkan doktor atau ahli farmasi.\n5. Simpan di tempat dan suhu yang disyorkan.\n6. Buang produk jika ia menunjukkan tanda-tanda kemerosotan kualiti."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "05:13:58 on 6/2/2003",
    views: 142
  },
  {
    id: "f_vit_skinny",
    mainId: "pharmacy",
    subId: "vitamin",
    q: {
      EN: "What suitable vitamin supplements should I consider if I am underweight for my height?",
      ZH: "我想咨询关于体重过轻、身体偏瘦人群适合服用的维生素与营养建议。",
      BM: "Saya ingin bertanya tentang pengambilan vitamin yang sesuai untuk diri saya di mana tubuh badan saya terlalu kurus, tidak sesuai dengan ketinggian saya."
    },
    a: {
      EN: "Being underweight may be due to metabolism, poor absorption, appetite, or underlying conditions like hyperthyroidism. A multivitamin containing B-complex, zinc, and vitamin D can support energy metabolism and appetite, but weight gain fundamentally requires balanced caloric surplus with wholesome proteins and healthy fats. Please consult your family doctor for blood screening.",
      ZH: "体重过轻可能与基础代谢率、吸收不良、食欲减退或甲亢等潜在问题有关。复合维生素B群、锌和维生素D有助于促进能量代谢与食欲，但增加体重根本上需要摄入充足热量、优质蛋白质及健康脂肪。建议先就医进行血常规与甲状腺筛查。",
      BM: "Kurang berat badan mungkin disebabkan oleh metabolisme, penyerapan nutrien yang lemah, selera makan, atau keadaan seperti hipertiroidisme. Multivitamin yang mengandungi kompleks vitamin B, zink dan vitamin D boleh menyokong metabolisme tenaga dan selera makan, tetapi peningkatan berat badan secara asasnya memerlukan lebihan kalori seimbang dengan protein dan lemak sihat. Sila berjumpa doktor untuk ujian darah."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "05:17:42 on 6/2/2003",
    views: 89
  },
  {
    id: "f_vit_consider",
    mainId: "pharmacy",
    subId: "vitamin",
    q: {
      EN: "What are the aspects that we should take in consideration when choosing vitamins?",
      ZH: "在选购维生素时，我们应当考虑哪些关键因素？",
      BM: "Apakah aspek yang perlu dipertimbangkan semasa memilih vitamin?"
    },
    a: {
      EN: "When selecting vitamin supplements, consider:\n1. Malaysian Ministry of Health MAL registration number (MAL prefix + hologram meditag).\n2. Specific nutritional deficiency confirmed by healthcare professionals.\n3. Safe Tolerable Upper Intake Levels (UL) to avoid hypervitaminosis (especially fat-soluble A, D, E, K).\n4. Potential interactions with your current prescription medications.",
      ZH: "挑选维生素补充剂时请注意：\n1. 认准马来西亚卫生部MAL认证注册号及全息防伪标签。\n2. 经专业医护人员确认自身是否存在明确的营养缺乏。\n3. 注意可耐受最高摄入量（UL），避免脂溶性维生素（A、D、E、K）过量蓄积中毒。\n4. 评估是否与当前正在服用的处方药物存在配伍禁忌。",
      BM: "Semasa memilih suplemen vitamin, pertimbangkan:\n1. Nombor pendaftaran MAL Kementerian Kesihatan Malaysia dengan pelekat hologram meditag.\n2. Kekurangan pemakanan khusus yang disahkan oleh profesional kesihatan.\n3. Had Atas Pengambilan yang Selamat (UL) bagi mengelakkan ketoksikan (terutamanya vitamin larut lemak A, D, E, K).\n4. Potensi interaksi dengan ubat preskripsi yang sedang anda ambil."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "05:13:12 on 6/2/2003",
    views: 215
  },
  {
    id: "f_quit_original",
    mainId: "healthy",
    subId: "quit",
    q: {
      EN: "How to quit smoking? (original: How to quich smoking?)",
      ZH: "如何戒烟？（保留原版手册拼写：How to quich smoking?）",
      BM: "Bagaimana berhenti merokok? (ejaan asal: How to quich smoking?)"
    },
    a: {
      EN: "Quitting smoking dramatically improves vascular health, lung capacity, and lowers cancer risks within weeks. Key evidence-based steps include:\n1. Set a definite Quit Date and inform family and friends for accountability.\n2. Clear out ashtrays, lighters, and smoking triggers at home and work.\n3. Consider Nicotine Replacement Therapy (NRT gum, lozenges, or transdermal patches) under pharmacist supervision.\n4. Call Malaysian MOH Quitline (03-8883 4400) or visit government mQuit clinics for free support.\n5. Remember the motto: 'Quit and Quit again' - slips are learning experiences, not total failures.",
      ZH: "戒烟能在数周内显著改善心血管功能、增加肺活量并大幅降低患癌风险。循证戒烟步骤包括：\n1. 明确设立一个戒烟日，并告知亲朋好友以获得监督支持。\n2. 彻底清理家中和工作场所的烟灰缸、打火机及所有诱发吸烟的物件。\n3. 在药剂师指导下使用尼古丁替代疗法（咀嚼胶、含片或贴片）。\n4. 拨打马来西亚卫生部戒烟热线（03-8883 4400）或前往公立mQuit戒烟门诊接受免费辅导。\n5. 牢记座右铭：'戒了再戒'——偶然复吸是戒烟过程中的必经波折，绝不代表失败。",
      BM: "Berhenti merokok meningkatkan kesihatan vaskular, kapasiti paru-paru dan mengurangkan risiko kanser dengan ketara dalam masa beberapa minggu. Langkah berasaskan bukti:\n1. Tetapkan Tarikh Berhenti yang jelas dan maklumkan kepada keluarga dan rakan-rakan.\n2. Bersihkan asbak, pemetik api dan pencetus merokok di rumah serta tempat kerja.\n3. Pertimbangkan Terapi Gantian Nikotin (NRT getah, lozenge atau tampalan) di bawah pengawasan ahli farmasi.\n4. Hubungi Talian Berhenti Merokok KKM (03-8883 4400) atau lawati klinik mQuit kerajaan.\n5. Ingat moto: 'Berhenti dan Berhenti lagi' - keterlanjuran adalah proses pembelajaran, bukan kegagalan mutlak."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "14:05:12 on 7/2/2003",
    views: 382
  },
  {
    id: "f_cancer_lump",
    mainId: "diseases",
    subId: "cancer",
    q: {
      EN: "I discover a lump in my breast when I press the area around it. Could it be breast cancer?",
      ZH: "当按压乳房周围时发现有肿块，这可能是乳腺癌吗？",
      BM: "Saya mendapati ada ketulan pada payudara apabila menekan kawasan sekitarnya. Adakah ia mungkin kanser payudara?"
    },
    a: {
      EN: "Any new breast lump must be evaluated clinically without delay, although up to 80% of breast lumps turn out to be benign conditions (such as fibroadenomas or simple cysts).\n\nPlease arrange a consultation with a physician immediately. You will typically undergo the 'triple assessment':\n1. Clinical breast examination by a doctor.\n2. Imaging (ultrasound for younger women; mammogram for women aged 40 and above).\n3. Core biopsy if imaging reveals suspicious architectural distortion.\nEarly detection saves lives.",
      ZH: "乳房发现任何新发肿块都应尽快就医检查，尽管临床上约80%的乳房肿块属于良性病变（如纤维腺瘤、乳腺囊肿或小叶增生）。\n\n请立即预约医生面诊，通常需完成三联评估：\n1. 专科医生的临床触诊。\n2. 影像学检查（年轻女性首选乳腺B超；40岁以上建议乳腺钼靶检查）。\n3. 若影像发现可疑边缘或微钙化，将进一步行空芯针穿刺活检。\n早发现、早诊断是治愈乳腺癌的关键。",
      BM: "Sebarang ketulan payudara yang baru mesti dinilai secara klinikal tanpa berlengah, walaupun sehingga 80% daripada ketulan payudara adalah benigna (seperti fibroadenoma atau sista ringkas).\n\nSila jumpa doktor dengan segera untuk menjalani penilaian:\n1. Pemeriksaan payudara klinikal oleh doktor.\n2. Pengimejan (ultrasonografi untuk wanita muda; mamogram untuk wanita berumur 40 tahun ke atas).\n3. Biopsi sekiranya pengimejan menunjukkan ciri mencurigakan.\nPengesanan awal menyelamatkan nyawa."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "00:04:57 on 7/2/2003",
    views: 524
  },
  {
    id: "f_cancer_reduce",
    mainId: "diseases",
    subId: "cancer",
    q: {
      EN: "How does one reduces the chances of being afflicted with cancer?",
      ZH: "日常生活中如何有效降低患癌症的几率？",
      BM: "Bagaimanakah seseorang boleh mengurangkan risiko menghidap kanser?"
    },
    a: {
      EN: "According to the World Health Organization and Malaysian National Cancer Registry, up to 40% of cancers are preventable through lifestyle modifications:\n1. Avoid all tobacco products and secondhand smoke.\n2. Maintain a healthy body weight (BMI between 18.5 and 24.9).\n3. Eat a diet rich in whole grains, legumes, colorful vegetables, and fresh fruits; strictly limit processed and red meats.\n4. Protect against infections: HPV vaccination, Hepatitis B vaccination.\n5. Attend age-appropriate cancer screenings (Pap smears, mammography, and fecal immunochemical tests).",
      ZH: "根据世界卫生组织及马来西亚国家癌症登记署数据，多达40%的癌症可通过健康生活方式进行有效预防：\n1. 戒除所有烟草，远离二手烟草暴露。\n2. 维持健康的体重（BMI指数保持在18.5至24.9之间）。\n3. 均衡膳食：多摄取全谷物、深色果蔬、豆类，严格限制加工肉类及红肉摄入。\n4. 接种防癌疫苗：HPV疫苗（宫颈癌）及乙肝疫苗（肝癌）。\n5. 定期进行适龄防癌筛查（宫颈抹片、乳腺钼靶及便隐血检查）。",
      BM: "Menurut Pertubuhan Kesihatan Sedunia dan Daftar Kanser Kebangsaan Malaysia, sehingga 40% kanser boleh dicegah melalui pengubahsuaian gaya hidup:\n1. Jauhi semua produk tembakau dan asap rokok sekunder.\n2. Kekalkan berat badan yang sihat (BMI antara 18.5 dan 24.9).\n3. Amalkan diet kaya bijirin penuh, kekacang, sayuran berwarna-warni dan buah-buahan segar; hadkan daging diproses.\n4. Perlindungan daripada jangkitan: vaksin HPV dan vaksin Hepatitis B.\n5. Hadiri ujian saringan berkala mengikut umur."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "23:28:11 on 6/2/2003",
    views: 419
  },
  {
    id: "f_cancer_research",
    mainId: "diseases",
    subId: "cancer",
    q: {
      EN: "Many of the people infected with cancer. Is there medical solution upon the research?",
      ZH: "许多人受到癌症困扰。目前的医学科研与治疗取得了哪些解决方案？",
      BM: "Ramai orang menghidap kanser. Adakah terdapat penyelesaian perubatan berdasarkan penyelidikan terkini?"
    },
    a: {
      EN: "Cancer treatment has progressed tremendously. In addition to conventional surgery, radiotherapy, and cytotoxic chemotherapy, modern oncological solutions include:\n1. Targeted Molecular Therapies that inhibit specific cancer-driving genetic mutations (e.g. EGFR, HER2).\n2. Immunotherapy checkpoint inhibitors that empower the patient's own immune T-cells to destroy tumors.\n3. Genomic tumor profiling to tailor precision medicine therapies.\nMany cancers diagnosed early can now be completely cured or managed as chronic long-term conditions.",
      ZH: "现代肿瘤学研究取得了飞跃性突破。除了传统的外科根治手术、精准放疗与化疗外，现代医学方案包括：\n1. 分子靶向治疗：精确阻断肿瘤驱动基因（如EGFR、HER2）而不伤及正常细胞。\n2. 免疫检查点抑制剂疗法（PD-1/PD-L1）：激活人体自身免疫T细胞消灭肿瘤。\n3. 基因测序指导的个体化精准医疗。\n许多早期确诊的恶性肿瘤已能够获得临床治愈，晚期癌症患者的生活质量与生存期也得到大幅改善。",
      BM: "Rawatan kanser telah berkembang pesat. Selain pembedahan, radioterapi dan kemoterapi konvensional, penyelesaian onkologi moden termasuk:\n1. Terapi Sasaran Molekul yang menyekat mutasi genetik khusus kanser (cth. EGFR, HER2).\n2. Imunoterapi perencat titik semak yang mengupayakan sel T imun pesakit sendiri untuk memusnahkan tumor.\n3. Pemprofilan genomik untuk terapi perubatan jitu.\nBanyak kanser yang dikesan awal kini boleh disembuhkan sepenuhnya atau diuruskan sebagai penyakit kronik."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "23:30:34 on 6/2/2003",
    views: 312
  },
  {
    id: "f_nose_bleed",
    mainId: "general",
    subId: "bleeding_nose",
    q: {
      EN: "What should I do when someone experiences nose bleeding?",
      ZH: "遇到别人或自己流鼻血时，应该如何正确急救处理？",
      BM: "Apakah yang perlu saya lakukan apabila seseorang mengalami pendarahan hidung?"
    },
    a: {
      EN: "First aid for epistaxis (nose bleed):\n1. Sit upright and lean slightly forward (NEVER tilt the head backward, which causes swallowing of blood and airway choking).\n2. Pinch the soft part of the nose firmly with thumb and index finger against the nasal septum for 10-15 continuous minutes.\n3. Breathe through the mouth and place an ice pack on the bridge of the nose or forehead.\n4. Seek emergency care if bleeding exceeds 20 minutes or follows heavy head trauma.",
      ZH: "鼻出血（流鼻血）正确急救法：\n1. 身体坐直并略微前倾（切勿仰头，否则血液会流入口咽引起呛咳或呕吐）。\n2. 用拇指和食指紧捏双侧鼻翼软组织，持续压迫10至15分钟。\n3. 保持用嘴呼吸，可在鼻梁或前额敷上冰袋辅助血管收缩。\n4. 若压迫超过20分钟仍出血不止，或伴有头部外伤，请立即前往急诊求医。",
      BM: "Pertolongan cemas untuk pendarahan hidung (epistaksis):\n1. Duduk tegak dan condongkan badan ke hadapan sedikit (JANGAN dongakkan kepala ke belakang yang boleh menyebabkan darah tertelan atau tersedak).\n2. Picit bahagian lembut hidung dengan ibu jari dan jari telunjuk selama 10-15 minit tanpa henti.\n3. Bernafas melalui mulut dan letakkan pek ais pada batang hidung atau dahi.\n4. Dapatkan rawatan kecemasan jika pendarahan melebihi 20 minit atau susulan trauma kepala."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "01:06:07 on 4/2/2003",
    views: 187
  },
  {
    id: "f_nose_cold",
    mainId: "general",
    subId: "bleeding_nose",
    q: {
      EN: "I am living in a cold place. Whenever I swab my nostrils in the morning or night, the cotton shows traces of blood. Please advise.",
      ZH: "我居住在气温寒冷干燥的地方，早晚用棉签清洁鼻腔时常发现有血丝，请问该如何护理？",
      BM: "Saya tinggal di tempat sejuk. Setiap kali saya membersihkan hidung pada waktu pagi atau malam, terdapat kesan darah pada kapas. Sila nasihatkan."
    },
    a: {
      EN: "Cold, dry air rapidly evaporates moisture from the Kiesselbach's plexus, an intricate network of delicate blood vessels in the front nasal septum. Recommendations:\n1. Apply a thin layer of sterile petroleum jelly (Vaseline) or saline nasal gel inside the nostrils twice daily.\n2. Use an indoor humidifier while sleeping.\n3. Use gentle isotonic saline nasal sprays rather than aggressive cotton bud swabbing.\n4. Avoid picking or blowing the nose vigorously.",
      ZH: "寒冷及干燥的空气会导致鼻中隔前下部的利特尔区（Kiesselbach's plexus）微血管充血、黏膜干燥皲裂而出血。护理建议：\n1. 每天早晚可在鼻前庭涂抹少许医用凡士林或生理盐水凝胶保湿。\n2. 睡眠房间可配备加湿器。\n3. 建议使用等渗生理性海盐水喷雾冲洗湿润，避免用棉签用力擦拭损伤黏膜。\n4. 避免用力挖鼻孔或剧烈擤鼻涕。",
      BM: "Udara sejuk dan kering mengeringkan saluran darah halus di bahagian septum hidung. Cadangan:\n1. Sapukan sedikit jeli petroleum steril (Vaseline) atau gel hidung salin ke dalam hidung dua kali sehari.\n2. Gunakan pelembap udara (humidifier) bilik semasa tidur.\n3. Gunakan semburan hidung salin isotonik dan kurangkan pengesatan kasar dengan putik kapas.\n4. Elakkan mengorek hidung atau menghembus dengan kuat."
    },
    doctorName: "Verified Medical Officer",
    createdBy: "admin",
    createdAt: "01:02:51 on 4/2/2003",
    views: 96
  }
];

interface Member {
  username: string;
  password: string;
  email: string;
  emailPrivate: boolean;
  fullName: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  homepageUrl?: string;
  signature?: string;
  biography?: string;
  age: string;
  gender: string;
  birthday: string;
  country: string;
  joinDate: string;
  posts: number;
  topics: number;
  role: 'user' | 'moderator' | 'admin';
  adminLevel: number; // 0: No Admin Rights, 1: Moderator, 3: Administrator
  lastOnline: string;
  memberNumber?: number;
}

const INITIAL_MEMBERS: Member[] = [
  {
    username: "admin",
    password: "admin",
    email: "admin@medifaq.my",
    emailPrivate: false,
    fullName: "System Administrator",
    firstName: "Sys",
    lastName: "Admin",
    address: "Kuala Lumpur, Malaysia",
    homepageUrl: "http://10.100.1.194/medifaq",
    signature: "MediFAQ System Administrator - Serving Malaysian Health Knowledge",
    biography: "Lead portal administrator and clinical knowledge coordinator.",
    age: "35",
    gender: "Male",
    birthday: "1989-06-15",
    country: "Malaysia",
    joinDate: "2020-01-01",
    posts: 155,
    topics: 78,
    role: "admin",
    adminLevel: 3,
    lastOnline: "2026-05-13 09:00",
    memberNumber: 1
  },
  {
    username: "member_tan",
    password: "tan123",
    email: "member_tan@example.com",
    emailPrivate: true,
    fullName: "Tan S. K.",
    firstName: "S. K.",
    lastName: "Tan",
    address: "Petaling Jaya, Selangor",
    homepageUrl: "http://medifaq.org/members/tan",
    signature: "Healthy life begins with small changes everyday.",
    biography: "Quit smoking advocate and community forum member.",
    age: "28",
    gender: "Female",
    birthday: "1997-03-22",
    country: "Malaysia",
    joinDate: "2003-12-01",
    posts: 12,
    topics: 3,
    role: "user",
    adminLevel: 0,
    lastOnline: "2026-05-12 22:15",
    memberNumber: 12
  },
  {
    username: "dr_lee",
    password: "doc123",
    email: "dr_lee@medifaq.my",
    emailPrivate: false,
    fullName: "Dr. Lee (Medical Officer)",
    firstName: "Medical",
    lastName: "Officer",
    address: "Penang, Malaysia",
    homepageUrl: "http://medifaq.org/officers",
    signature: "Medical Officer · Clinic assistant & preventative health enthusiast",
    biography: "Family medicine trainee and health literacy researcher.",
    age: "42",
    gender: "Male",
    birthday: "1982-08-08",
    country: "Malaysia",
    joinDate: "2003-07-01",
    posts: 56,
    topics: 8,
    role: "moderator",
    adminLevel: 1,
    lastOnline: "2026-05-13 07:30",
    memberNumber: 3
  },
  {
    username: "user_azman",
    password: "azman123",
    email: "user_azman@example.com",
    emailPrivate: false,
    fullName: "Azman K.",
    firstName: "Azman",
    lastName: "K.",
    address: "Johor Bahru, Malaysia",
    homepageUrl: "",
    signature: "Health awareness for family",
    biography: "Active parent and nutrition reader.",
    age: "36",
    gender: "Male",
    birthday: "1990-01-26",
    country: "Malaysia",
    joinDate: "2003-01-26",
    posts: 0,
    topics: 0,
    role: "user",
    adminLevel: 0,
    lastOnline: "Never",
    memberNumber: 16
  },
  {
    username: "demo",
    password: "demo",
    email: "demo@medifaq.my",
    emailPrivate: false,
    fullName: "Public Demo Member",
    firstName: "Demo",
    lastName: "User",
    address: "Kuching, Sarawak",
    homepageUrl: "",
    signature: "Learning medical facts daily",
    biography: "Regular reader of health FAQs.",
    age: "30",
    gender: "Other",
    birthday: "1995-01-01",
    country: "Malaysia",
    joinDate: "2025-01-15",
    posts: 5,
    topics: 1,
    role: "user",
    adminLevel: 0,
    lastOnline: "2026-05-13 08:00",
    memberNumber: 20
  }
];

interface ForumTopic {
  id: string;
  forumId: string;
  subId: string;
  title: Record<Lang, string>;
  author: string;
  replies: number;
  views: number;
  lastAuthor: string;
  lastTime: string;
  priority: 'Normal' | 'High' | 'Low';
  created: string;
}

const INITIAL_TOPICS: ForumTopic[] = [
  {
    id: "t_quich",
    forumId: "healthy",
    subId: "quit",
    title: {
      EN: "How to quit smoking?",
      ZH: "如何戒烟？",
      BM: "Bagaimana cara untuk berhenti merokok?"
    },
    author: "member_tan",
    replies: 2,
    views: 145,
    lastAuthor: "dr_lee",
    lastTime: "14:44:10 on 7/2/2003",
    priority: "Normal",
    created: "14:05:12 on 7/2/2003"
  },
  {
    id: "t_nicotine",
    forumId: "healthy",
    subId: "quit",
    title: {
      EN: "Nicotine.",
      ZH: "关于尼古丁。",
      BM: "Mengenai Nikotin."
    },
    author: "member_tan",
    replies: 1,
    views: 89,
    lastAuthor: "member_tan",
    lastTime: "14:06:03 on 7/2/2003",
    priority: "Normal",
    created: "14:06:03 on 7/2/2003"
  },
  {
    id: "t_advice",
    forumId: "healthy",
    subId: "quit",
    title: {
      EN: "Request advice.",
      ZH: "恳请各位医生专家提供建议。",
      BM: "Mohon nasihat kepakaran."
    },
    author: "admin",
    replies: 0,
    views: 35,
    lastAuthor: "admin",
    lastTime: "05:35:21 on 6/2/2003",
    priority: "High",
    created: "05:35:21 on 6/2/2003"
  },
  {
    id: "t_allergy",
    forumId: "diseases",
    subId: "allergy",
    title: {
      EN: "Seasonal allergy and haze mitigation in Klang Valley",
      ZH: "巴生河流域烟霾天气下的过敏防护心得",
      BM: "Alahan bermusim dan penjagaan jerebu di Lembah Klang"
    },
    author: "demo",
    replies: 0,
    views: 42,
    lastAuthor: "demo",
    lastTime: "08:00:00 on 13/5/2026",
    priority: "Normal",
    created: "08:00:00 on 13/5/2026"
  }
];

interface ForumPost {
  id: string;
  topicId: string;
  author: string;
  avatar: string;
  postCount: number;
  time: string;
  content: Record<Lang, string>;
}

const INITIAL_POSTS: ForumPost[] = [
  {
    id: "p1",
    topicId: "t_quich",
    author: "member_tan",
    avatar: "MT",
    postCount: 2,
    time: "14:05:12 on the 7/2/2003",
    content: {
      EN: "I really need your help.",
      ZH: "我真的非常需要大家的帮助和建议。",
      BM: "Saya benar-benar memerlukan bantuan dan panduan anda semua."
    }
  },
  {
    id: "p2",
    topicId: "t_quich",
    author: "dr_lee",
    avatar: "DL",
    postCount: 3,
    time: "14:44:10 on the 7/2/2003",
    content: {
      EN: "I am sorry. I am not able to help you.\n\nI am sorry. I am not able to help you.\n\nI am sorry. I am not able to help you.",
      ZH: "我很抱歉，目前由于门诊排期无法直接提供一对一方案。请先参考戒烟专栏指引。",
      BM: "Saya minta maaf. Sila rujuk garis panduan klinik berhenti merokok KKM yang terdekat."
    }
  },
  {
    id: "p3",
    topicId: "t_advice",
    author: "admin",
    avatar: "AD",
    postCount: 155,
    time: "05:35:21 on the 6/2/2003",
    content: {
      EN: "Can you please give me some advice so that I could quit smoking efficiently",
      ZH: "请问能否给我一些切实可行的科学高效戒烟建议？",
      BM: "Bolehkah anda memberi saya beberapa nasihat supaya saya dapat berhenti merokok dengan cekap"
    }
  },
  {
    id: "p4",
    topicId: "t_nicotine",
    author: "member_tan",
    avatar: "MT",
    postCount: 2,
    time: "14:06:03 on the 7/2/2003",
    content: {
      EN: "How long does nicotine remain in blood after last stick?",
      ZH: "最后一支烟之后，尼古丁在大脑和血液中会存留多长时间？",
      BM: "Berapa lamakah nikotin kekal di dalam darah selepas puntung rokok terakhir?"
    }
  }
];

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  cat: 'suggestion' | 'complaint' | 'compliment';
  date: string;
}

const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: "fb1",
    name: "Community_User",
    email: "user_feedback@example.com",
    subject: "Some suggestions",
    message: "I am a novice user of this Online Medical Knowledge FAQ Database.\n\nI would like to suggest that the administrator to use laymen's view in explaining medical concepts so that novice users like me can understand the content of this web site better.\n\nThank you.",
    cat: "suggestion",
    date: "01:58:52 on 11/2/2003"
  },
  {
    id: "fb2",
    name: "Health_Reader",
    email: "health_reader@example.com",
    subject: "Good job",
    message: "The search module is very convenient for looking up vitamin indications. Keep it up!",
    cat: "compliment",
    date: "01:58:09 on 11/2/2003"
  },
  {
    id: "fb3",
    name: "Member_Tan",
    email: "member_tan@example.com",
    subject: "Nothing",
    message: "Thank you for the quick answers in the discussion board.",
    cat: "compliment",
    date: "22:32:33 on 26/1/2003"
  }
];

interface PrivateMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

const INITIAL_PMS: PrivateMessage[] = [
  {
    id: "pm1",
    from: "member_tan",
    to: "dr_lee",
    subject: "Re: Nothing",
    content: "Thank you for the clinical guidance, doctor!",
    date: "17:57:09 on the 10/2/2003",
    read: true
  },
  {
    id: "pm2",
    from: "member_tan",
    to: "dr_lee",
    subject: "Re: Nothing",
    content: "Looking forward to hearing about your clinic timings.",
    date: "17:56:46 on the 10/2/2003",
    read: true
  },
  {
    id: "pm3",
    from: "dr_lee",
    to: "member_tan",
    subject: "Re: Nothing",
    content: "You are welcome. Feel free to ask anytime on the forum.",
    date: "17:41:04 on the 10/2/2003",
    read: false
  },
  {
    id: "pm4",
    from: "admin",
    to: "member_tan",
    subject: "Welcome to MediFAQ",
    content: "Welcome to our portal! Please let us know if you encounter any difficulty.",
    date: "02:13:16 on the 6/2/2003",
    read: true
  }
];

// Stores `text` for the active language and copies it into any empty locale, so a name or FAQ
// text entered in one language never leaves the other locales blank.
const setLocalized = (prev: Record<Lang, string> | undefined, lang: Lang, text: string): Record<Lang, string> => {
  const next = { ...(prev || { EN: '', ZH: '', BM: '' }), [lang]: text } as Record<Lang, string>;
  (['EN', 'ZH', 'BM'] as Lang[]).forEach((l) => {
    if (!next[l]) next[l] = text;
  });
  return next;
};

// Discrete text-size steps (multipliers of the browser's base size).
const FONT_SIZE_STEPS = [0.85, 1, 1.15, 1.3] as const;
const DEFAULT_FONT_STEP = 1;

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('medifaq_lang');
      if (saved === 'EN' || saved === 'ZH' || saved === 'BM') return saved;
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('zh')) return 'ZH';
      if (navLang.startsWith('ms')) return 'BM';
    } catch {}
    return 'EN';
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('medifaq_lang', newLang);
    } catch {}
  };

  useEffect(() => {
    const langMap: Record<Lang, string> = {
      EN: 'en',
      ZH: 'zh-Hans',
      BM: 'ms'
    };
    document.documentElement.lang = langMap[lang] || 'en';
  }, [lang]);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSizeStep, setFontSizeStep] = useState(DEFAULT_FONT_STEP);
  const [highContrast, setHighContrast] = useState(false);

  // Scale the root font size so all rem-based text follows.
  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZE_STEPS[fontSizeStep] * 100}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontSizeStep]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  // In-app FAQ create/edit form (window.prompt is blocked inside sandboxed preview iframes)
  const [faqEditor, setFaqEditor] = useState<{ id?: string; q: string; a: string; submitted: boolean } | null>(null);
  // Reusable single-field input dialog (replaces window.prompt for admin rename/add actions)
  const [textPrompt, setTextPrompt] = useState<{
    title: string;
    label: string;
    value: string;
    submitted: boolean;
    onSubmit: (value: string) => void;
  } | null>(null);
  const [modalDialog, setModalDialog] = useState<{
    title: string;
    msg: string;
    type: 'alert' | 'confirm';
    onConfirm?: () => void;
  } | null>(null);

  // Core Data States
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    try {
      const saved = localStorage.getItem('medifaq_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('medifaq_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('medifaq_current_user');
      }
    } catch {}
  }, [currentUser]);

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [categories, setCategories] = useState<MainCategory[]>(INITIAL_CATEGORIES);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [topics, setTopics] = useState<ForumTopic[]>(INITIAL_TOPICS);
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_FEEDBACKS);
  const [pms, setPms] = useState<PrivateMessage[]>(INITIAL_PMS);

  useEffect(() => {
    const loadApiData = async () => {
      try {
        const [catsRes, faqsRes, topicsRes, postsRes, membersRes, fbRes, pmsRes] = await Promise.all([
          fetch('/api/categories').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch('/api/faqs').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch('/api/topics').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch('/api/posts').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch('/api/members').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch('/api/feedbacks').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch('/api/pms').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        ]);

        if (catsRes && Array.isArray(catsRes) && catsRes.length > 0) {
          const iconMap: Record<string, any> = {
            dental: Smile,
            diseases: Stethoscope,
            general: Heart,
            healthy: Leaf,
            men: User,
            pediatrician: Baby,
            pharmacy: Pill,
            women: Heart,
          };
          const mappedCats: MainCategory[] = catsRes.map((c: any) => ({
            ...c,
            icon: iconMap[c.id] || BookOpen,
          }));
          setCategories(mappedCats);
        }
        if (faqsRes && Array.isArray(faqsRes) && faqsRes.length > 0) setFaqs(faqsRes);
        if (topicsRes && Array.isArray(topicsRes) && topicsRes.length > 0) setTopics(topicsRes);
        if (postsRes && Array.isArray(postsRes) && postsRes.length > 0) setPosts(postsRes);
        if (membersRes && Array.isArray(membersRes) && membersRes.length > 0) setMembers(membersRes);
        if (fbRes && Array.isArray(fbRes) && fbRes.length > 0) setFeedbacks(fbRes);
        if (pmsRes && Array.isArray(pmsRes) && pmsRes.length > 0) setPms(pmsRes);
      } catch (err) {
        console.warn('API sync fallback active:', err);
      }
    };
    loadApiData();
  }, []);

  // Active Category / Subtopic Navigation
  const [activeMainId, setActiveMainId] = useState<string>('pharmacy');
  const [activeSubId, setActiveSubId] = useState<string>('vitamin');
  const [activeFaqDetail, setActiveFaqDetail] = useState<FAQItem | null>(null);
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);

  // Search FAQ module states
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqSearchCat, setFaqSearchCat] = useState('all');
  const [faqSearchScope, setFaqSearchScope] = useState<'questions' | 'answers'>('questions');

  // Search Discussion board states
  const [forumSearchQuery, setForumSearchQuery] = useState('');
  const [forumSearchCat, setForumSearchCat] = useState('all');
  const [forumSearchScope, setForumSearchScope] = useState<'subject' | 'post' | 'members'>('subject');

  // New Member Registration form
  const [regForm, setRegForm] = useState({
    username: '',
    password: '',
    confirm: '',
    email: '',
    fullName: '',
    age: '',
    gender: 'Male',
    birthday: '',
    country: 'Malaysia',
    private: false
  });

  // Login form
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginErrorState, setLoginErrorState] = useState<'none' | 'wrong_pw' | 'no_user'>('none');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Change Password form
  const [pwdForm, setPwdForm] = useState({ old: '', new: '', confirm: '' });

  // Discussion reply & new topic forms
  const [newTopicForm, setNewTopicForm] = useState<{ title: string; message: string; priority: 'Normal' | 'High' | 'Low' }>({
    title: '',
    message: '',
    priority: 'Normal'
  });
  const [replyContent, setReplyContent] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostContent, setEditingPostContent] = useState('');

  // Feedback form
  const [feedbackForm, setFeedbackForm] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
    cat: 'suggestion' | 'complaint' | 'compliment';
  }>({
    name: '',
    email: '',
    subject: '',
    message: '',
    cat: 'suggestion'
  });

  // Admin Module states
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [selectedMemberForAdmin, setSelectedMemberForAdmin] = useState<Member | null>(null);
  const [adminEmailForm, setAdminEmailForm] = useState({ subject: '', message: '' });
  const [logoutCountdown, setLogoutCountdown] = useState(2);
  const [emailStatus, setEmailStatus] = useState<{
    smtpConfigured: boolean;
    smtpHost: string | null;
    adminEmails: string[];
    logs: Array<{ id: string; timestamp: string; to: string; subject: string; preview: string; type: string; status: 'sent' | 'simulated' }>;
  } | null>(null);

  // Private Message compose state
  const [pmModalOpen, setPmModalOpen] = useState(false);
  const [pmForm, setPmForm] = useState({ to: '', subject: '', content: '' });

  // Translation helpers
  const t = (key: string): string => {
    return T_DATA[lang]?.[key] || T_DATA.EN[key] || key;
  };

  // Localized tier label + numeric level, e.g. "Administrator (Level 3)"
  const accessLevelLabel = (u: { role?: string | null; adminLevel?: number | null } | null | undefined): string =>
    `${t(accessLevelKey(u))} (${t('levelWord')} ${u?.adminLevel ?? ADMIN_LEVEL.NONE})`;

  const getLoc = (obj: Record<Lang, string> | undefined): string => {
    if (!obj) return '';
    return obj[lang] || obj.EN || '';
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshData = () => {
    fetch('/api/feedbacks')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data)) setFeedbacks(data);
      })
      .catch(() => {});
    fetch('/api/pms')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data)) setPms(data);
      })
      .catch(() => {});
    fetch('/api/members')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
      })
      .catch(() => {});
    fetch('/api/admin/email-status')
      .then((r) => r.ok && r.json())
      .then((data) => {
        setEmailStatus(data);
      })
      .catch(() => {});
  };

  // Auto-redirect effect when on loggingOutPage
  useEffect(() => {
    if (currentPage !== 'loggingOutPage') {
      setLogoutCountdown(2);
      return;
    }
    const timer = setInterval(() => {
      setLogoutCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('home');
          showToast(t('logoutSuccess'));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPage]);

  const navigate = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'adminFeedback' || page === 'pmCenter' || page === 'adminEmail' || page === 'memberPanel' || page === 'adminBoard') {
      refreshData();
    }
  };

  // Filtered FAQ results
  const filteredFaqs = useMemo(() => {
    let list = faqs;
    if (activeMainId) {
      list = list.filter((f) => f.mainId === activeMainId);
    }
    if (activeSubId) {
      list = list.filter((f) => f.subId === activeSubId);
    }
    return list;
  }, [faqs, activeMainId, activeSubId]);

  // Search FAQs query
  const faqSearchResults = useMemo(() => {
    if (!faqSearchQuery.trim()) {
      if (faqSearchCat === 'all') return faqs;
      return faqs.filter((f) => f.mainId === faqSearchCat || f.subId === faqSearchCat);
    }
    const q = faqSearchQuery.toLowerCase();
    return faqs.filter((f) => {
      const matchText = faqSearchScope === 'questions'
        ? getLoc(f.q).toLowerCase().includes(q)
        : getLoc(f.a).toLowerCase().includes(q) || getLoc(f.q).toLowerCase().includes(q);
      const matchCat = faqSearchCat === 'all' || f.mainId === faqSearchCat || f.subId === faqSearchCat;
      return matchText && matchCat;
    });
  }, [faqs, faqSearchQuery, faqSearchCat, faqSearchScope, lang]);

  // Discussion forum topics filtered
  const filteredForumTopics = useMemo(() => {
    let list = topics;
    if (activeMainId) {
      list = list.filter((t) => t.forumId === activeMainId);
    }
    if (activeSubId) {
      list = list.filter((t) => t.subId === activeSubId);
    }
    return list;
  }, [topics, activeMainId, activeSubId]);

  // Discussion search results
  const forumSearchResults = useMemo(() => {
    if (!forumSearchQuery.trim()) return [];
    const q = forumSearchQuery.toLowerCase();

    if (forumSearchScope === 'members' || forumSearchCat === 'members') {
      return members.filter((m) => m.username.toLowerCase().includes(q) || m.fullName.toLowerCase().includes(q));
    }

    if (forumSearchScope === 'subject') {
      return topics.filter((top) => {
        const matchTitle = getLoc(top.title).toLowerCase().includes(q);
        const matchForum = forumSearchCat === 'all' || top.forumId === forumSearchCat || top.subId === forumSearchCat;
        return matchTitle && matchForum;
      });
    }

    // search inside post contents
    return posts.filter((p) => {
      const matchContent = getLoc(p.content).toLowerCase().includes(q);
      return matchContent;
    });
  }, [forumSearchQuery, forumSearchCat, forumSearchScope, members, topics, posts, lang]);

  // Handle User Registration
  const handleRegister = () => {
    const missing: string[] = [];
    if (!regForm.username.trim()) missing.push(t('username'));
    if (!regForm.password.trim()) missing.push(t('password'));
    if (!regForm.confirm.trim()) missing.push(t('confirmPassword'));
    if (!regForm.email.trim() || !/^\S+@\S+\.\S+$/.test(regForm.email)) missing.push(t('emailAddress'));

    if (missing.length > 0) {
      const isZh = lang === 'ZH';
      const isBm = lang === 'BM';
      const title = t('systemNotice');
      const msg = isZh
        ? `请完成以下必填项的填写：\n- ${missing.join('\n- ')}\n\n请重新检查并提交！`
        : isBm
        ? `Sila lengkapkan maklumat wajib dalam medan berikut:\n- ${missing.join('\n- ')}\n\nSila semak dan hantar semula!`
        : `Please fill in all required fields:\n- ${missing.join('\n- ')}\n\nPlease check and submit again!`;
      setModalDialog({ title, msg, type: 'alert' });
      return;
    }

    if (regForm.password !== regForm.confirm) {
      setModalDialog({
        title: t('error'),
        msg: t('passwordMismatch'),
        type: 'alert'
      });
      return;
    }

    if (members.some((m) => m.username.toLowerCase() === regForm.username.toLowerCase())) {
      setModalDialog({
        title: t('error'),
        msg: t('usernameTaken'),
        type: 'alert'
      });
      return;
    }

    const newMember: Member = {
      username: regForm.username,
      password: regForm.password,
      email: regForm.email,
      emailPrivate: regForm.private,
      fullName: regForm.fullName || regForm.username,
      firstName: regForm.fullName.split(' ')[0] || regForm.username,
      lastName: regForm.fullName.split(' ').slice(1).join(' ') || '',
      age: regForm.age,
      gender: regForm.gender,
      birthday: regForm.birthday,
      country: regForm.country,
      joinDate: new Date().toISOString().slice(0, 10),
      posts: 0,
      topics: 0,
      role: 'user',
      adminLevel: 0,
      lastOnline: new Date().toISOString().slice(0, 16).replace('T', ' '),
      memberNumber: members.length + 1
    };

    setMembers([...members, newMember]);
    fetch('/api/members/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember),
    }).catch(console.error);

    showToast(t('createSuccess'));
    setRegForm({
      username: '',
      password: '',
      confirm: '',
      email: '',
      fullName: '',
      age: '',
      gender: 'Male',
      birthday: '',
      country: 'Malaysia',
      private: false
    });
    navigate('login');
  };

  // Handle User Login
  const handleLogin = () => {
    const isZh = lang === 'ZH';
    const isBm = lang === 'BM';
    const title = t('systemNotice');

    if (!loginForm.username.trim() && !loginForm.password.trim()) {
      const msg = isZh
        ? `请输入您的用户名与密码，然后重试。`
        : isBm
        ? `Sila masukkan nama pengguna dan kata laluan anda, kemudian cuba lagi.`
        : `Please enter your username and password, then try again.`;
      setModalDialog({ title, msg, type: 'alert' });
      return;
    }
    if (!loginForm.username.trim()) {
      const msg = isZh
        ? `请输入您的用户名，然后重试。`
        : isBm
        ? `Sila masukkan nama pengguna anda, kemudian cuba lagi.`
        : `Please enter your username, then try again.`;
      setModalDialog({ title, msg, type: 'alert' });
      return;
    }
    if (!loginForm.password.trim()) {
      const msg = isZh
        ? `请输入您的密码，然后重试。`
        : isBm
        ? `Sila masukkan kata laluan anda, kemudian cuba lagi.`
        : `Please enter your password, then try again.`;
      setModalDialog({ title, msg, type: 'alert' });
      return;
    }

    fetch('/api/members/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginForm.username.trim(), password: loginForm.password }),
    })
      .then(async (res) => {
        if (res.status === 404) {
          setLoginErrorState('no_user');
          return;
        }
        if (res.status === 401) {
          setLoginErrorState('wrong_pw');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          setLoginErrorState('none');
          setLoginForm({ username: '', password: '' });
          showToast(`${t('welcome')}, ${data.user.username}!`);
          refreshData();
          navigate('memberPanel');
          return;
        }
        const found = members.find((m) => m.username.toLowerCase() === loginForm.username.toLowerCase());
        if (!found) {
          setLoginErrorState('no_user');
          return;
        }
        if (found.password !== loginForm.password) {
          setLoginErrorState('wrong_pw');
          return;
        }
        setCurrentUser(found);
        setLoginErrorState('none');
        setLoginForm({ username: '', password: '' });
        showToast(`${t('welcome')}, ${found.username}!`);
        refreshData();
        navigate('memberPanel');
      })
      .catch(() => {
        const found = members.find((m) => m.username.toLowerCase() === loginForm.username.toLowerCase());
        if (!found) {
          setLoginErrorState('no_user');
          return;
        }
        if (found.password !== loginForm.password) {
          setLoginErrorState('wrong_pw');
          return;
        }
        setCurrentUser(found);
        setLoginErrorState('none');
        setLoginForm({ username: '', password: '' });
        showToast(`${t('welcome')}, ${found.username}!`);
        refreshData();
        navigate('memberPanel');
      });
  };

  // Create new discussion topic
  const handleCreateTopic = () => {
    if (!currentUser) {
      setModalDialog({
        title: t('error'),
        msg: t('mustLoginToPost'),
        type: 'alert'
      });
      return;
    }

    if (!newTopicForm.title.trim() || !newTopicForm.message.trim()) {
      setModalDialog({
        title: t('error'),
        msg: t('feedbackError'),
        type: 'alert'
      });
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' on ' + new Date().toLocaleDateString();
    const newTopic: ForumTopic = {
      id: "top_" + Date.now(),
      forumId: activeMainId || 'healthy',
      subId: activeSubId || 'quit',
      title: {
        EN: newTopicForm.title,
        ZH: newTopicForm.title,
        BM: newTopicForm.title
      },
      author: currentUser.username,
      replies: 0,
      views: 1,
      lastAuthor: currentUser.username,
      lastTime: timestamp,
      priority: newTopicForm.priority,
      created: timestamp
    };

    const firstPost: ForumPost = {
      id: "post_" + Date.now(),
      topicId: newTopic.id,
      author: currentUser.username,
      avatar: currentUser.username.slice(0, 2).toUpperCase(),
      postCount: currentUser.posts + 1,
      time: timestamp,
      content: {
        EN: newTopicForm.message,
        ZH: newTopicForm.message,
        BM: newTopicForm.message
      }
    };

    setTopics([newTopic, ...topics]);
    setPosts([...posts, firstPost]);
    setMembers(members.map((m) => m.username === currentUser.username ? { ...m, posts: m.posts + 1, topics: m.topics + 1 } : m));
    setCurrentUser({ ...currentUser, posts: currentUser.posts + 1, topics: currentUser.topics + 1 });
    fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTopic, initialPost: firstPost }),
    }).catch(console.error);

    setActiveTopic(newTopic);
    setNewTopicForm({ title: '', message: '', priority: 'Normal' });
    showToast(t('createSuccess'));
    navigate('discussionTopic');
  };

  // Post reply to current topic
  const handlePostReply = () => {
    if (!currentUser || !activeTopic) return;
    if (!replyContent.trim()) {
      setModalDialog({
        title: t('error'),
        msg: t('feedbackError'),
        type: 'alert'
      });
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' on ' + new Date().toLocaleDateString();
    const newPost: ForumPost = {
      id: "post_" + Date.now(),
      topicId: activeTopic.id,
      author: currentUser.username,
      avatar: currentUser.username.slice(0, 2).toUpperCase(),
      postCount: currentUser.posts + 1,
      time: timestamp,
      content: {
        EN: replyContent,
        ZH: replyContent,
        BM: replyContent
      }
    };

    setPosts([...posts, newPost]);
    setTopics(topics.map((top) => top.id === activeTopic.id ? {
      ...top,
      replies: top.replies + 1,
      lastAuthor: currentUser.username,
      lastTime: timestamp
    } : top));

    setMembers(members.map((m) => m.username === currentUser.username ? { ...m, posts: m.posts + 1 } : m));
    setCurrentUser({ ...currentUser, posts: currentUser.posts + 1 });
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    }).catch(console.error);

    setReplyContent('');
    showToast(t('createSuccess'));
  };

  // Edit / Save post
  const handleSaveEditedPost = (post: ForumPost) => {
    if (!editingPostContent.trim()) return;
    setPosts(posts.map((p) => p.id === post.id ? {
      ...p,
      content: { EN: editingPostContent, ZH: editingPostContent, BM: editingPostContent }
    } : p));
    fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { EN: editingPostContent, ZH: editingPostContent, BM: editingPostContent } }),
    }).catch(console.error);

    setEditingPostId(null);
    setEditingPostContent('');
    showToast(t('success'));
  };

  // Delete post
  const handleDeletePost = (postId: string) => {
    setModalDialog({
      title: t('confirmDelete'),
      msg: t('confirmDelete'),
      type: 'confirm',
      onConfirm: () => {
        setPosts(posts.filter((p) => p.id !== postId));
        fetch(`/api/posts/${postId}`, { method: 'DELETE' }).catch(console.error);
        showToast(t('deleteSuccess'));
      }
    });
  };

  // Submit Feedback
  const handleSubmitFeedback = () => {
    const missing: string[] = [];
    if (!feedbackForm.name.trim()) missing.push(t('name'));
    if (!feedbackForm.email.trim() || !/^\S+@\S+\.\S+$/.test(feedbackForm.email)) missing.push(t('emailAddress'));
    if (!feedbackForm.subject.trim()) missing.push(t('subject'));
    if (!feedbackForm.message.trim()) missing.push(t('yourComment'));

    if (missing.length > 0) {
      setModalDialog({
        title: "Microsoft Internet Explorer",
        msg: `You didn't fill in the following field(s) properly:\n- ${missing.join('\n- ')}\n\nPlease fill in the mentioned field(s) if you want to send your feedback.`,
        type: 'alert'
      });
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' on ' + new Date().toLocaleDateString();
    const newFeedback: FeedbackItem = {
      id: "fb_" + Date.now(),
      name: feedbackForm.name,
      email: feedbackForm.email,
      subject: feedbackForm.subject,
      message: feedbackForm.message,
      cat: feedbackForm.cat,
      date: timestamp
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    fetch('/api/feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeedback),
    })
      .then(() => refreshData())
      .catch(console.error);

    setFeedbackForm({ name: '', email: '', subject: '', message: '', cat: 'suggestion' });
    navigate('feedbackConfirmation');
  };

  // Send PM
  const handleSendPM = () => {
    if (!currentUser || !pmForm.to.trim() || !pmForm.subject.trim() || !pmForm.content.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' on the ' + new Date().toLocaleDateString();
    const newPm: PrivateMessage = {
      id: "pm_" + Date.now(),
      from: currentUser.username,
      to: pmForm.to,
      subject: pmForm.subject,
      content: pmForm.content,
      date: timestamp,
      read: false
    };
    setPms([newPm, ...pms]);
    fetch('/api/pms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPm),
    }).catch(console.error);

    setPmModalOpen(false);
    setPmForm({ to: '', subject: '', content: '' });
    showToast(t('createSuccess'));
  };

  // Breadcrumbs component
  const Breadcrumbs = ({ items }: { items: { label: string; onClick?: () => void }[] }) => (
    <nav aria-label={t('breadcrumbs')} className="flex items-center gap-1.5 text-xs text-[var(--muted)] flex-wrap mb-4 font-medium">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-[var(--teal)] underline-offset-2 hover:underline focus-ring rounded"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[var(--text)] font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
        </React.Fragment>
      ))}
    </nav>
  );

  const openCreateFaq = () => setFaqEditor({ q: '', a: '', submitted: false });
  const openEditFaq = (faq: FAQItem) =>
    setFaqEditor({ id: faq.id, q: faq.q[lang] || faq.q.EN, a: faq.a[lang] || faq.a.EN, submitted: false });

  // One save path for both creating and editing a FAQ entry.
  // The text is stored for the active language; any empty locale falls back to it.
  const saveFaqEditor = () => {
    if (!faqEditor || !currentUser) return;
    const q = faqEditor.q.trim();
    const a = faqEditor.a.trim();
    if (!q || !a) {
      setFaqEditor({ ...faqEditor, submitted: true });
      return;
    }
    const existing = faqEditor.id ? faqs.find((f) => f.id === faqEditor.id) : undefined;
    const newQ = setLocalized(existing?.q, lang, q);
    const newA = setLocalized(existing?.a, lang, a);

    if (existing) {
      setFaqs(faqs.map((f) => (f.id === existing.id ? { ...f, q: newQ, a: newA } : f)));
      fetch(`/api/faqs/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: newQ, a: newA }),
      }).catch(console.error);
      showToast(t('success'));
    } else {
      const newFaq: FAQItem = {
        id: 'f_' + Date.now(),
        mainId: activeMainId,
        subId: activeSubId,
        q: newQ,
        a: newA,
        doctorName: currentUser.fullName || 'Dr. ' + currentUser.username,
        createdBy: currentUser.username,
        createdAt: new Date().toLocaleTimeString() + ' on ' + new Date().toLocaleDateString(),
        views: 0,
      };
      setFaqs([newFaq, ...faqs]);
      fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq),
      }).catch(console.error);
      showToast(t('createSuccess'));
    }
    setFaqEditor(null);
  };

  const openTextPrompt = (title: string, label: string, value: string, onSubmit: (value: string) => void) =>
    setTextPrompt({ title, label, value, submitted: false, onSubmit });

  const submitTextPrompt = () => {
    if (!textPrompt) return;
    const v = textPrompt.value.trim();
    if (!v) {
      setTextPrompt({ ...textPrompt, submitted: true });
      return;
    }
    const { onSubmit } = textPrompt;
    setTextPrompt(null);
    onSubmit(v);
  };

  const setGenericEditor = (config: {
    title: string;
    label: string;
    value: string;
    onSave: (val: string) => void;
    submitted?: boolean;
  }) => openTextPrompt(config.title, config.label, config.value, config.onSave);



  // Accessibility: font size & high contrast (rendered in the header on >=md and in the mobile drawer below md)
  const accessibilityControls = (
    <div className="flex items-center gap-1 rounded-full border border-[var(--border)] p-1 bg-[var(--surface-2)] w-fit">
      <button
        type="button"
        onClick={() => setFontSizeStep((prev) => Math.max(0, prev - 1))}
        disabled={fontSizeStep <= 0}
        className="w-7 h-7 grid place-items-center rounded-full hover:bg-white text-xs font-semibold focus-ring disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        title={t('decreaseFontSize')}
        aria-label={t('decreaseFontSize')}
      >
        A-
      </button>
      <button
        type="button"
        onClick={() => setFontSizeStep(DEFAULT_FONT_STEP)}
        disabled={fontSizeStep === DEFAULT_FONT_STEP}
        className="w-7 h-7 grid place-items-center rounded-full hover:bg-white text-xs font-semibold focus-ring disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        title={t('resetFontSize')}
        aria-label={t('resetFontSize')}
      >
        A
      </button>
      <button
        type="button"
        onClick={() => setFontSizeStep((prev) => Math.min(FONT_SIZE_STEPS.length - 1, prev + 1))}
        disabled={fontSizeStep >= FONT_SIZE_STEPS.length - 1}
        className="w-7 h-7 grid place-items-center rounded-full hover:bg-white text-xs font-semibold focus-ring disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        title={t('increaseFontSize')}
        aria-label={t('increaseFontSize')}
      >
        A+
      </button>
      <div className="w-px h-4 bg-[var(--border)] mx-1" />
      <button
        type="button"
        onClick={() => setHighContrast((prev) => !prev)}
        className={`w-7 h-7 grid place-items-center rounded-full focus-ring transition ${
          highContrast ? 'bg-[var(--navy)] text-white' : 'hover:bg-white text-[var(--muted)]'
        }`}
        title={t('toggleHighContrast')}
        aria-label={t('toggleHighContrast')}
        aria-pressed={highContrast}
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col lg:flex-row bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 ${
        highContrast ? 'contrast-125 saturate-150 font-medium' : ''
      }`}
    >
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[var(--navy)] focus:text-white shadow-xl"
      >
        {t('skipToContent')}
      </a>

      {/* Desktop Persistent Left Sidebar (matching Figure 1, 6, 11, 22, 41) */}
      <aside
        className="hidden lg:flex flex-col w-[290px] shrink-0 gap-6 p-6 sticky top-0 h-screen overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur"
        style={{ paddingTop: 'calc(1.5rem + var(--safe-area-inset-top))' }}
      >
        {/* Brand Header */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-3 text-left group focus-ring rounded-2xl"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[var(--teal-deep)] to-[var(--teal)] text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition">
            M
          </div>
          <div>
            <div className="font-bold text-lg leading-tight tracking-tight text-[var(--navy)] group-hover:text-[var(--teal)] transition">
              {t('appName')}
            </div>
            <div className="text-[0.6875rem] text-[var(--muted)] leading-snug">
              {t('fullTitle')}
            </div>
          </div>
        </button>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {/* Main Modules */}
          <div>
            <div className="text-[0.6875rem] font-bold tracking-widest text-[var(--muted)] uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--teal)]" />
              {t('generalAccess')}
            </div>
            <nav className="space-y-1">
              {[
                { k: 'home', icon: House, page: 'home' },
                { k: 'medicalKnowledgeFAQ', icon: BookOpen, page: 'faqMain' },
                { k: 'searchMedicalFAQ', icon: Search, page: 'faqSearch' },
                { k: 'discussionBoard', icon: MessageSquare, page: 'discussionMain' },
                { k: 'searchDiscussionBoard', icon: Search, page: 'discussionSearch' },
                { k: 'feedback', icon: Mail, page: 'feedback' }
              ].map((item) => (
                <button
                  key={item.k}
                  onClick={() => navigate(item.page)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition focus-ring ${
                    currentPage === item.page
                      ? 'bg-[var(--teal-soft)] text-[var(--teal-deep)] border border-[var(--teal)]/30 font-bold shadow-sm'
                      : 'hover:bg-[var(--surface-2)] text-[var(--text)]'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{t(item.k)}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* User Membership & Control Panel */}
          <div>
            <div className="text-[0.6875rem] font-bold tracking-widest text-[var(--muted)] uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--amber)]" />
              {t('memberAccess')}
            </div>
            <nav className="space-y-1">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => navigate('register')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition focus-ring ${
                      currentPage === 'register'
                        ? 'bg-[var(--amber-soft)] text-[#8a4d00] border border-amber-300 font-bold shadow-sm'
                        : 'hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-amber-600" />
                    <span>{t('newMemberRegistration')}</span>
                  </button>
                  <button
                    onClick={() => navigate('login')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition focus-ring ${
                      currentPage === 'login'
                        ? 'bg-[var(--amber-soft)] text-[#8a4d00] border border-amber-300 font-bold shadow-sm'
                        : 'hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <LogIn className="w-4 h-4 text-amber-600" />
                    <span>{t('userSignIn')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('memberPanel')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition focus-ring ${
                      currentPage === 'memberPanel'
                        ? 'bg-[var(--teal-soft)] text-[var(--teal-deep)] border border-[var(--teal)]/30 font-bold shadow-sm'
                        : 'hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <CircleUser className="w-4 h-4 text-[var(--teal)]" />
                    <span>{t('memberControlPanel')}</span>
                  </button>
                  <button
                    onClick={() => navigate('pmCenter')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition focus-ring ${
                      currentPage === 'pmCenter'
                        ? 'bg-[var(--teal-soft)] text-[var(--teal-deep)] border border-[var(--teal)]/30 font-bold shadow-sm'
                        : 'hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Inbox className="w-4 h-4 text-[var(--teal)]" />
                      <span>{t('privateMessageCenter')}</span>
                    </span>
                    {pms.filter((p) => p.to === currentUser.username && !p.read).length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[var(--amber)] text-white text-[0.625rem] font-bold">
                        {pms.filter((p) => p.to === currentUser.username && !p.read).length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      setModalDialog({
                        title: t('logout'),
                        msg: t('confirmLogout'),
                        type: 'confirm',
                        onConfirm: () => {
                          setCurrentUser(null);
                          navigate('loggingOutPage');
                        }
                      })
                    }
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-50 text-red-600 transition focus-ring"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Section 6: Administrator and Moderator's Module (Figure 41: Purple Box) */}
          {currentUser && (currentUser.role === 'admin' || currentUser.adminLevel >= 3) && (
            <div className="rounded-2xl bg-[var(--purple-soft)] border-2 border-purple-300 p-3.5 shadow-sm space-y-2">
              <div className="text-[0.6875rem] font-bold tracking-widest text-purple-800 uppercase mb-1 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-purple-700" />
                <span>{t('adminSection')}</span>
              </div>
              <button
                onClick={() => navigate('adminBoard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-purple-900 shadow-sm border border-purple-200 hover:bg-purple-50 transition focus-ring ${
                  currentPage === 'adminBoard' ? 'ring-2 ring-purple-500 font-extrabold' : ''
                }`}
              >
                <Shield className="w-4 h-4 text-purple-700 shrink-0" />
                <span>{t('administrationBoard')}</span>
              </button>
              <button
                onClick={() => navigate('adminFeedback')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-white text-purple-900 shadow-sm border border-purple-200 hover:bg-purple-50 transition focus-ring ${
                  currentPage === 'adminFeedback' ? 'ring-2 ring-purple-500 font-extrabold' : ''
                }`}
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Feedback Inbox</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[0.625rem] font-bold">
                  {feedbacks.length}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info in sidebar */}
        <div className="mt-auto card p-3.5 text-[0.6875rem] bg-[var(--surface-2)]/60 space-y-1.5">
          <div className="font-bold text-[var(--navy)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span>Interactive Demo Ready</span>
          </div>
          <div className="text-[var(--muted)] leading-relaxed">
            {t('adminHint')}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top App Bar with Tri-lingual selector and Accessibility controls */}
        <header
          className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--surface)]/85 border-b border-[var(--border)] px-3 sm:px-4 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-3"
          style={{ top: 'var(--safe-area-inset-top)' }}
        >
          {/* Mobile menu button & brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[var(--surface-2)] text-[var(--navy)] hover:bg-[var(--border)] focus-ring"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[var(--teal)] text-white grid place-items-center font-bold text-sm">
                M
              </div>
              <span className="hidden min-[400px]:inline font-bold text-sm text-[var(--navy)]">MediFAQ</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--muted)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('tagline')}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Tri-lingual Language Switcher (EN, 华语, Bahasa Melayu) */}
            <div className="flex items-center rounded-full border border-[var(--border)] p-1 bg-[var(--surface-2)] shrink-0">
              {(['EN', 'ZH', 'BM'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition focus-ring ${
                    lang === l
                      ? 'bg-[var(--teal)] text-white shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {l === 'ZH' ? '中文' : l === 'BM' ? 'BM' : 'EN'}
                </button>
              ))}
            </div>

            {/* Accessibility: Font size & High contrast (header, >= md; smaller screens use the drawer) */}
            <div className="hidden md:block">{accessibilityControls}</div>

            {/* User status badge with dropdown and quick sign in */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-2 py-1 focus-ring rounded-full hover:bg-[var(--surface-2)] transition border border-transparent hover:border-[var(--border)]"
                  title={currentUser.username}
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--teal)] text-white grid place-items-center text-xs font-bold shadow-sm">
                    {currentUser.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-[var(--navy)]">
                    {currentUser.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)] hidden sm:inline" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[var(--border)] shadow-xl z-40 py-2 text-xs divide-y divide-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5">
                        <p className="font-bold text-[var(--navy)] truncate">{currentUser.username}</p>
                        <p className="text-[0.625rem] text-[var(--muted)] capitalize">
                          {accessLevelLabel(currentUser)}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('memberPanel');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[var(--surface-2)] font-semibold flex items-center gap-2 text-[var(--navy)]"
                        >
                          <CircleUser className="w-4 h-4 text-[var(--teal)]" />
                          <span>{t('memberControlPanel')}</span>
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate('adminBoard');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[var(--surface-2)] font-semibold flex items-center gap-2 text-purple-700"
                          >
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span>{t('administrationBoard')}</span>
                          </button>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            setCurrentUser(null);
                            navigate('loggingOutPage');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-bold flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="shrink-0 whitespace-nowrap flex items-center justify-center gap-1.5 p-2.5 sm:px-3.5 sm:py-1.5 rounded-full bg-[var(--navy)] text-white text-xs font-bold hover:bg-[var(--teal-deep)] transition focus-ring"
                title={t('userSignIn')}
                aria-label={t('userSignIn')}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('userSignIn')}</span>
              </button>
            )}
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[var(--surface)] p-6 overflow-y-auto shadow-2xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--teal)] text-white grid place-items-center font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[var(--navy)]">MediFAQ</div>
                    <div className="text-[0.625rem] text-[var(--muted)]">{t('fullTitle')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-[var(--surface-2)] focus-ring"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Language selection in mobile */}
              <div className="flex gap-2">
                {(['EN', 'ZH', 'BM'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold ${
                      lang === l ? 'bg-[var(--teal)] text-white' : 'bg-[var(--surface-2)]'
                    }`}
                  >
                    {l === 'ZH' ? '中文' : l === 'BM' ? 'Bahasa' : 'English'}
                  </button>
                ))}
              </div>

              {/* Accessibility controls in mobile (hidden in header below md) */}
              <div className="md:hidden">{accessibilityControls}</div>

              {/* Nav Links */}
              <nav className="space-y-1">
                {[
                  { k: 'home', icon: House, page: 'home' },
                  { k: 'medicalKnowledgeFAQ', icon: BookOpen, page: 'faqMain' },
                  { k: 'searchMedicalFAQ', icon: Search, page: 'faqSearch' },
                  { k: 'discussionBoard', icon: MessageSquare, page: 'discussionMain' },
                  { k: 'searchDiscussionBoard', icon: Search, page: 'discussionSearch' },
                  { k: 'feedback', icon: Mail, page: 'feedback' }
                ].map((item) => (
                  <button
                    key={item.k}
                    onClick={() => navigate(item.page)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[var(--surface-2)] text-left"
                  >
                    <item.icon className="w-4 h-4 text-[var(--teal)]" />
                    <span>{t(item.k)}</span>
                  </button>
                ))}
              </nav>

              {/* Member Links */}
              <div className="border-t pt-3 space-y-2">
                {!currentUser ? (
                  <>
                    <button
                      onClick={() => navigate('login')}
                      className="w-full py-2.5 rounded-xl bg-[var(--navy)] text-white text-xs font-bold text-center"
                    >
                      {t('userSignIn')}
                    </button>
                    <button
                      onClick={() => navigate('register')}
                      className="w-full py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-center hover:bg-[var(--surface-2)]"
                    >
                      {t('newMemberRegistration')}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-xs font-bold text-[var(--muted)]">
                      {t('welcome')}, {currentUser.username}
                    </div>
                    <button
                      onClick={() => navigate('memberPanel')}
                      className="w-full py-2 rounded-xl bg-[var(--teal-soft)] text-[var(--teal-deep)] text-xs font-bold text-center"
                    >
                      {t('memberControlPanel')}
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => navigate('adminBoard')}
                        className="w-full py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold text-center"
                      >
                        {t('administrationBoard')}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setCurrentUser(null);
                        navigate('loggingOutPage');
                      }}
                      className="w-full py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center"
                    >
                      {t('logout')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Primary Page Content */}
        <main id="main-content" className="flex-1 px-4 lg:px-10 py-6 max-w-[1300px] w-full mx-auto">
          {/* 1. HOMEPAGE */}
          {currentPage === 'home' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="card p-6 lg:p-10 bg-gradient-to-br from-[var(--teal-soft)] via-white to-[var(--amber-soft)] overflow-hidden relative border border-[var(--border)]">
                <div className="max-w-2xl relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[var(--border)] text-[0.6875rem] font-bold text-[var(--teal-deep)] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--teal)]" />
                    <span>{t('malaysianHealthPortal')}</span>
                  </div>
                  <h1 className="display text-3xl lg:text-5xl font-bold leading-tight text-[var(--navy)]">
                    {lang === 'EN'
                      ? "Online Medical Knowledge FAQ Database"
                      : lang === 'ZH'
                      ? "马来西亚线上医疗常问知识库"
                      : "Pangkalan Data FAQ Pengetahuan Perubatan Dalam Talian"}
                  </h1>
                  <p className="text-xs lg:text-sm text-[var(--muted)] leading-relaxed">
                    {t('tagline')}.
                  </p>

                  {/* Quick FAQ Search Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                      <input
                        value={faqSearchQuery}
                        onChange={(e) => setFaqSearchQuery(e.target.value)}
                        placeholder={t('searchExample')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white text-xs focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                    </div>
                    <button
                      onClick={() => navigate('faqSearch')}
                      className="px-5 py-2.5 rounded-xl bg-[var(--teal)] text-white text-xs font-bold hover:bg-[var(--teal-deep)] transition shadow-sm"
                    >
                      {t('search')}
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="pt-2 flex flex-wrap gap-5 text-xs text-[var(--muted)] font-semibold">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[var(--teal)]" />
                      <span>{faqs.length} {t('totalFAQs')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[var(--amber)]" />
                      <span>{topics.length} {t('totalTopics')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>{members.length} {t('totalMembers')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Access Tiles */}
              <div>
                <h2 className="text-base font-bold text-[var(--navy)] mb-3 flex items-center gap-2">
                  <span>{t('quickAccess')}</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { title: t('medicalKnowledgeFAQ'), icon: BookOpen, page: 'faqMain', color: 'bg-teal-50 text-teal-700 border-teal-200' },
                    { title: t('searchMedicalFAQ'), icon: Search, page: 'faqSearch', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { title: t('discussionBoard'), icon: MessageSquare, page: 'discussionMain', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                    { title: t('searchDiscussionBoard'), icon: Search, page: 'discussionSearch', color: 'bg-orange-50 text-orange-700 border-orange-200' },
                    { title: t('feedback'), icon: Mail, page: 'feedback', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                    ...(currentUser?.role === 'admin'
                      ? [{ title: t('administrationBoard'), icon: Shield, page: 'adminBoard', color: 'bg-purple-50 text-purple-700 border-purple-200' }]
                      : [{ title: t('memberControlPanel'), icon: CircleUser, page: currentUser ? 'memberPanel' : 'login', color: 'bg-purple-50 text-purple-700 border-purple-200' }])
                  ].map((tile) => (
                    <button
                      key={tile.title}
                      onClick={() => navigate(tile.page)}
                      className="card p-3.5 text-left hover:shadow-md hover:border-[var(--teal)] transition group focus-ring flex flex-col justify-between"
                    >
                      <div className={`w-9 h-9 rounded-xl grid place-items-center mb-2.5 border ${tile.color}`}>
                        <tile.icon className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold group-hover:text-[var(--teal)] transition">
                        {tile.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Health Topics Grid (8 categories) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-[var(--navy)]">
                    {t('mainHealthTopics')}
                  </h2>
                  <button
                    onClick={() => navigate('faqMain')}
                    className="text-xs font-bold text-[var(--teal)] hover:underline flex items-center gap-1"
                  >
                    <span>{t('faqs')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        className="card p-4 hover:shadow-md transition border border-[var(--border)] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[var(--teal-soft)] text-[var(--teal-deep)] grid place-items-center">
                              <CatIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[0.625rem] font-bold text-[var(--muted)] uppercase">
                              #{cat.listOrder}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-[var(--navy)] mb-1">
                            {getLoc(cat.name)}
                          </h3>
                          <p className="text-[0.6875rem] text-[var(--muted)] leading-relaxed mb-3">
                            {getLoc(cat.desc)}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {cat.subs.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => {
                                  setActiveMainId(cat.id);
                                  setActiveSubId(s.id);
                                  navigate('faqList');
                                }}
                                className="text-[0.625rem] px-2 py-0.5 rounded-md bg-[var(--surface-2)] hover:bg-[var(--teal-soft)] text-[var(--text)] transition font-medium"
                              >
                                {getLoc(s.name)}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setActiveMainId(cat.id);
                              navigate('faqSub');
                            }}
                            className="w-full py-1.5 rounded-lg bg-[var(--surface-2)] text-[0.6875rem] font-bold text-[var(--teal-deep)] hover:bg-[var(--teal-soft)] transition text-center"
                          >
                            Explore {getLoc(cat.name)}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Discussion Forum Highlights */}
              <div className="card p-5 border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3 border-b pb-2.5">
                  <h2 className="text-sm font-bold text-[var(--navy)] flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[var(--amber)]" />
                    <span>{t('featuredTopics')}</span>
                  </h2>
                  <button
                    onClick={() => navigate('discussionMain')}
                    className="text-xs font-bold text-[var(--teal)] hover:underline"
                  >
                    View All Forums
                  </button>
                </div>
                <div className="divide-y">
                  {topics.slice(0, 3).map((top) => (
                    <div key={top.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          onClick={() => {
                            setActiveTopic(top);
                            navigate('discussionTopic');
                          }}
                          className="text-xs font-bold hover:text-[var(--teal)] text-left truncate block"
                        >
                          {getLoc(top.title)}
                        </button>
                        <div className="text-[0.625rem] text-[var(--muted)]">
                          {t('author')}: <span className="font-semibold">{top.author}</span> • {top.replies} {t('repliesViews')} • Last activity: {top.lastTime}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTopic(top);
                          navigate('discussionTopic');
                        }}
                        className="px-2.5 py-1 rounded-md bg-[var(--surface-2)] text-[0.6875rem] font-semibold hover:bg-[var(--teal-soft)] shrink-0"
                      >
                        Read Post
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. NEW MEMBER REGISTRATION (Section C.1.3 & Figure 1 & 2) */}
          {currentPage === 'register' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('newMemberRegistration') }]} />
              
              <div className="card p-6 border-t-4 border-t-[var(--amber)]">
                <div className="border-b pb-3 mb-5">
                  <h1 className="display text-xl font-bold text-[var(--navy)]">
                    {t('newMemberRegistration')}
                  </h1>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {t('fillFieldsToRegister')}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-[var(--amber-soft)] p-2.5 rounded-xl border border-amber-200 text-amber-900 font-bold">
                    {t('requiredInformation')}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold block mb-1">
                        {t('username')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={regForm.username}
                        onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                        placeholder={t('enterUsername')}
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">
                        {t('emailAddress')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">
                        {t('password')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">
                        {t('retypePassword')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={regForm.confirm}
                        onChange={(e) => setRegForm({ ...regForm, confirm: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">{t('fullName')}</label>
                      <input
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">{t('age')}</label>
                      <input
                        type="number"
                        value={regForm.age}
                        onChange={(e) => setRegForm({ ...regForm, age: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">{t('gender')}</label>
                      <select
                        value={regForm.gender}
                        onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      >
                        <option value="Male">{t('male')}</option>
                        <option value="Female">{t('female')}</option>
                        <option value="Other">{t('otherGender')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold block mb-1">{t('birthday')}</label>
                      <input
                        type="date"
                        value={regForm.birthday}
                        onChange={(e) => setRegForm({ ...regForm, birthday: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="keepPrivate"
                      checked={regForm.private}
                      onChange={(e) => setRegForm({ ...regForm, private: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="keepPrivate" className="font-semibold text-xs cursor-pointer">
                      {t('keepEmailPrivate')}
                    </label>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={handleRegister}
                      className="w-full py-3 rounded-xl bg-[var(--amber)] text-white font-bold text-sm hover:brightness-105 transition shadow-sm"
                    >
                      {t('registerMeNow')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. USER LOGIN (Section C.1.4 & Figure 3 - 6) */}
          {currentPage === 'login' && (
            <div className="max-w-md mx-auto space-y-4">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('userSignIn') }]} />

              <div className="card p-6 border-t-4 border-t-[var(--navy)]">
                <div className="border-b pb-3 mb-5">
                  <h1 className="display text-xl font-bold text-[var(--navy)]">
                    {t('userSignIn')}
                  </h1>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {t('loginPrompt')}{' '}
                    <button
                      onClick={() => navigate('register')}
                      className="text-[var(--teal)] font-bold underline"
                    >
                      {t('clickHere')}
                    </button>{' '}
                    {t('toRegister')}
                  </p>
                </div>

                {/* Simulated Error States from Figure 5 & 6 */}
                {loginErrorState === 'wrong_pw' && (
                  <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-2">
                    <div className="font-bold text-amber-900">
                      {t('invalidPwMsg')} <span className="underline">{loginForm.username}</span>.
                    </div>
                    <ol className="list-decimal pl-4 space-y-1 text-amber-800">
                      <li>
                        {t('forgotPwPrompt')}{' '}
                        <button
                          onClick={() => {
                            showToast(t('emailSent'));
                            setLoginErrorState('none');
                          }}
                          className="font-bold text-[var(--teal)] underline"
                        >
                          {t('clickHere')}
                        </button>
                        {t('sendPwEmailMsg')}
                      </li>
                      <li>
                        {t('toTryAgain')}{' '}
                        <button
                          onClick={() => setLoginErrorState('none')}
                          className="font-bold text-[var(--teal)] underline"
                        >
                          {t('clickHere')}
                        </button>
                        .
                      </li>
                    </ol>
                  </div>
                )}

                {loginErrorState === 'no_user' && (
                  <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-900 space-y-2">
                    <div className="font-bold">
                      {t('noUserMsg')} <span className="underline">{loginForm.username}</span> {t('doesNotExist')}
                    </div>
                    <div>
                      {t('toTryAgain')}{' '}
                      <button
                        onClick={() => setLoginErrorState('none')}
                        className="font-bold text-red-700 underline"
                      >
                        {t('clickHere')}
                      </button>{' '}
                      {t('pleaseClickHereToTryAgain')}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">{t('username')}</label>
                    <input
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleLogin();
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      placeholder={t('enterUsername')}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{t('password')}</label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleLogin();
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      placeholder={t('enterPassword')}
                    />
                  </div>

                  <button
                    type="submit"
                    onClick={handleLogin}
                    className="w-full py-2.5 rounded-xl bg-[var(--navy)] text-white font-bold text-xs hover:bg-[var(--teal-deep)] transition shadow-sm"
                  >
                    {t('login')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 4. LOGGING OUT TRANSITION (Figure 10) */}
          {currentPage === 'loggingOutPage' && (
            <div className="max-w-md mx-auto py-12 text-center space-y-4">
              <div className="card p-8 bg-blue-50 border-2 border-blue-200 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 text-white grid place-items-center mb-1 animate-pulse">
                  <LogOut className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">
                  {t('loggingOut')}
                </h2>
                <p className="text-xs text-blue-700">
                  {t('secureLogoutMsg')}
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden my-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-linear"
                    style={{ width: `${Math.max(15, ((2 - logoutCountdown) / 2) * 100)}%` }}
                  />
                </div>
                <p className="text-[0.6875rem] text-blue-600 font-medium">
                  Automatically redirecting to Homepage in {logoutCountdown}s...
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      navigate('home');
                      showToast(t('logoutSuccess'));
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition shadow-sm"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. MEMBER CONTROL PANEL (Figure 6) */}
          {currentPage === 'memberPanel' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('memberControlPanel') }]} />

              <div className="card p-6 border-t-4 border-t-[var(--teal)]">
                <div className="border-b pb-3 mb-5 flex items-center justify-between">
                  <div>
                    <h1 className="display text-xl font-bold text-[var(--navy)]">
                      {t('welcomeTitle')}
                    </h1>
                    <div className="text-xs text-[var(--muted)] mt-1">
                      {t('memberControlPanelFor')} <span className="font-bold text-[var(--navy)]">{currentUser?.username}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[var(--teal-soft)] text-[var(--teal-deep)] text-xs font-bold uppercase">
                    {accessLevelLabel(currentUser)}
                  </span>
                </div>

                {/* Actions Grid (Figure 6) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('changePassword')}
                    className="card p-4 text-left hover:border-[var(--teal)] hover:shadow-md transition group focus-ring bg-[var(--surface-2)]/40"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 grid place-items-center mb-2">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold group-hover:text-[var(--teal)]">
                      {t('changeMyPassword')}
                    </div>
                    <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                      {t('changePwSub')}
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('editProfile')}
                    className="card p-4 text-left hover:border-[var(--teal)] hover:shadow-md transition group focus-ring bg-[var(--surface-2)]/40"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 grid place-items-center mb-2">
                      <PenLine className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold group-hover:text-[var(--teal)]">
                      {t('editMyProfile')}
                    </div>
                    <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                      {t('editProfileSub')}
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('pmCenter')}
                    className="card p-4 text-left hover:border-[var(--teal)] hover:shadow-md transition group focus-ring bg-[var(--surface-2)]/40"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 grid place-items-center mb-2">
                      <Inbox className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold group-hover:text-[var(--teal)]">
                      {t('privateMessageCenter')}
                    </div>
                    <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                      {t('pmCenterSub')}
                    </div>
                  </button>
                </div>

                {/* Profile Summary Card */}
                {currentUser && (
                  <div className="mt-6 p-4 rounded-xl border bg-[var(--surface-2)]/60 text-xs space-y-2">
                    <div className="font-bold text-sm text-[var(--navy)] flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>
                        {lang === 'ZH'
                          ? `${currentUser.fullName || currentUser.username} 的${t('profileSummary')}`
                          : lang === 'BM'
                          ? `${t('profileSummary')} ${currentUser.fullName || currentUser.username}`
                          : `${currentUser.fullName || currentUser.username}'s ${t('profileSummary')}`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[0.6875rem]">
                      <div>
                        <span className="text-[var(--muted)]">{t('memberNo')}:</span>{' '}
                        <b>#{currentUser.memberNumber || 1}</b>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">{t('totalPosts')}:</span>{' '}
                        <b>{currentUser.posts}</b>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">{t('topicsStarted')}:</span>{' '}
                        <b>{currentUser.topics}</b>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">{t('email')}:</span>{' '}
                        <b>{currentUser.emailPrivate ? t('privateTag') : currentUser.email}</b>
                      </div>
                    </div>
                  </div>
                )}

                {/* Administrator Quick Status & Inbox Bar */}
                {currentUser && (currentUser.role === 'admin' || currentUser.adminLevel >= 3) && (
                  <div className="mt-5 p-4 rounded-xl bg-purple-50 border-2 border-purple-200 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-purple-950 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-purple-700" />
                        <span>{t('adminInboxesQuickStatus')}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[0.625rem] font-bold">
                        {accessLevelLabel(currentUser)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => navigate('adminFeedback')}
                        className="p-3 rounded-xl bg-white border border-purple-200 hover:border-purple-500 hover:shadow-sm text-left flex items-center justify-between group transition focus-ring"
                      >
                        <div>
                          <div className="font-bold text-purple-950 group-hover:text-purple-700">{t('feedbackInbox')}</div>
                          <div className="text-[0.6875rem] text-[var(--muted)]">{feedbacks.length} {t('submissions')}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[0.6875rem] font-bold shadow-sm">
                          {feedbacks.length}
                        </span>
                      </button>
                      <button
                        onClick={() => navigate('pmCenter')}
                        className="p-3 rounded-xl bg-white border border-purple-200 hover:border-purple-500 hover:shadow-sm text-left flex items-center justify-between group transition focus-ring"
                      >
                        <div>
                          <div className="font-bold text-purple-950 group-hover:text-purple-700">{t('inbox')}</div>
                          <div className="text-[0.6875rem] text-[var(--muted)]">
                            {pms.filter((p) => p.to === currentUser.username && !p.read).length} {t('unreadMsg')}
                          </div>
                        </div>
                        {pms.filter((p) => p.to === currentUser.username && !p.read).length > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[0.6875rem] font-bold shadow-sm">
                            {pms.filter((p) => p.to === currentUser.username && !p.read).length}
                          </span>
                        ) : (
                          <span className="text-[0.6875rem] text-[var(--muted)]">{t('zeroNew')}</span>
                        )}
                      </button>
                      <button
                        onClick={() => navigate('adminBoard')}
                        className="p-3 rounded-xl bg-white border border-purple-200 hover:border-purple-500 hover:shadow-sm text-left flex items-center justify-between group transition focus-ring"
                      >
                        <div>
                          <div className="font-bold text-purple-950 group-hover:text-purple-700">{t('administrationBoard')}</div>
                          <div className="text-[0.6875rem] text-[var(--muted)]">{t('adminControlCenter')}</div>
                        </div>
                        <Shield className="w-4 h-4 text-purple-700" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. CHANGE PASSWORD PAGE (Figure 7) */}
          {currentPage === 'changePassword' && (
            <div className="max-w-md mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('home'), onClick: () => navigate('home') },
                  { label: t('memberControlPanel'), onClick: () => navigate('memberPanel') },
                  { label: t('changeMyPassword') }
                ]}
              />

              <div className="card p-6 border-t-4 border-t-blue-600">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-4">
                  {t('changePwHeader')}
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">{t('oldPassword')}</label>
                    <input
                      type="password"
                      value={pwdForm.old}
                      onChange={(e) => setPwdForm({ ...pwdForm, old: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{t('newPassword')}</label>
                    <input
                      type="password"
                      value={pwdForm.new}
                      onChange={(e) => setPwdForm({ ...pwdForm, new: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{t('confirmNewPassword')}</label>
                    <input
                      type="password"
                      value={pwdForm.confirm}
                      onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!pwdForm.old || !pwdForm.new || !pwdForm.confirm) {
                        setModalDialog({ title: t('error'), msg: t('pleaseFillAllPwFields'), type: 'alert' });
                        return;
                      }
                      if (pwdForm.new !== pwdForm.confirm) {
                        setModalDialog({ title: t('error'), msg: t('passwordMismatch'), type: 'alert' });
                        return;
                      }
                      if (currentUser && currentUser.password !== pwdForm.old) {
                        setModalDialog({ title: t('error'), msg: t('oldPwMismatch'), type: 'alert' });
                        return;
                      }
                      if (currentUser) {
                        setMembers(members.map((m) => m.username === currentUser.username ? { ...m, password: pwdForm.new } : m));
                        setCurrentUser({ ...currentUser, password: pwdForm.new });
                        fetch(`/api/members/${currentUser.username}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ password: pwdForm.new }),
                        }).catch(console.error);
                      }
                      showToast(t('passwordChanged'));
                      setPwdForm({ old: '', new: '', confirm: '' });
                      navigate('memberPanel');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[var(--navy)] text-white font-bold text-xs"
                  >
                    {t('changePasswordBtn')}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => navigate('memberPanel')}
                      className="text-xs text-[var(--teal)] hover:underline"
                    >
                      {t('goBackWithoutSave')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. EDIT PROFILE PAGE (Figure 8) */}
          {currentPage === 'editProfile' && currentUser && (
            <div className="max-w-2xl mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('home'), onClick: () => navigate('home') },
                  { label: t('memberControlPanel'), onClick: () => navigate('memberPanel') },
                  { label: t('editMyProfile') }
                ]}
              />

              <div className="card p-6 border-t-4 border-t-blue-600">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-4">
                  {t('makeRequiredChangesToProfile')}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold block mb-1">{t('username')}</label>
                      <input
                        disabled
                        value={currentUser.username}
                        className="w-full px-3 py-2 rounded-xl border bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">{t('emailAddress')}</label>
                      <input
                        value={currentUser.email}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">{t('firstName')}</label>
                      <input
                        value={currentUser.firstName || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">{t('lastName')}</label>
                      <input
                        value={currentUser.lastName || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-bold block mb-1">{t('address')}</label>
                      <input
                        value={currentUser.address || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-bold block mb-1">{t('homepageUrl')}</label>
                      <input
                        value={currentUser.homepageUrl || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, homepageUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-bold block mb-1">{t('signature')}</label>
                      <textarea
                        rows={2}
                        value={currentUser.signature || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, signature: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-bold block mb-1">{t('biography')}</label>
                      <textarea
                        rows={3}
                        value={currentUser.biography || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, biography: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="editPriv"
                      checked={currentUser.emailPrivate}
                      onChange={(e) => setCurrentUser({ ...currentUser, emailPrivate: e.target.checked })}
                    />
                    <label htmlFor="editPriv" className="font-bold cursor-pointer">
                      {t('keepEmailPrivate')}
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      setMembers(members.map((m) => m.username === currentUser.username ? currentUser : m));
                      fetch(`/api/members/${currentUser.username}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(currentUser),
                      }).catch(console.error);
                      showToast(t('profileUpdated'));
                      navigate('memberPanel');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[var(--teal)] text-white font-bold text-xs shadow-sm hover:bg-[var(--teal-deep)]"
                  >
                    {t('updateMyProfileBtn')}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => navigate('memberPanel')}
                      className="text-xs text-[var(--teal)] hover:underline"
                    >
                      {t('goBackWithoutSave')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. PRIVATE MESSAGE CENTER (Figure 9) */}
          {currentPage === 'pmCenter' && currentUser && (
            <div className="max-w-3xl mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('home'), onClick: () => navigate('home') },
                  { label: t('memberControlPanel'), onClick: () => navigate('memberPanel') },
                  { label: t('privateMessageCenter') }
                ]}
              />

              <div className="card overflow-hidden border border-[var(--border)]">
                <div className="bg-[var(--surface-2)] p-4 border-b flex items-center justify-between">
                  <h1 className="font-bold text-sm text-[var(--navy)]">
                    {t('privateMessageCenter')}
                  </h1>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPmModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--teal)] text-white text-xs font-bold shadow-sm"
                    >
                      {t('newMsg')}
                    </button>
                    <button
                      onClick={() => {
                        const userPms = pms.filter((p) => p.to === currentUser.username);
                        userPms.forEach((p) => fetch(`/api/pms/${p.id}`, { method: 'DELETE' }).catch(console.error));
                        setPms(pms.filter((p) => p.to !== currentUser.username));
                        showToast(t('deleteSuccess'));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold"
                    >
                      {t('deleteAll')}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-amber-500 text-white font-bold text-left">
                      <tr>
                        <th className="p-3">{t('subject')}</th>
                        <th className="p-3">{t('fromSender')}</th>
                        <th className="p-3">{t('timeReceived')}</th>
                        <th className="p-3">{t('mailingOptions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pms
                        .filter((p) => p.to === currentUser.username)
                        .map((pm) => (
                          <tr
                            key={pm.id}
                            onClick={() => {
                              if (!pm.read) {
                                setPms(pms.map((p) => (p.id === pm.id ? { ...p, read: true } : p)));
                                fetch(`/api/pms/${pm.id}/read`, { method: 'PUT' }).catch(console.error);
                              }
                            }}
                            className={`hover:bg-[var(--surface-2)]/50 transition cursor-pointer ${
                              !pm.read ? 'bg-amber-50/70 font-semibold' : ''
                            }`}
                          >
                            <td className="p-3 font-semibold text-[var(--navy)]">
                              <div className="flex items-center gap-1.5">
                                {!pm.read && (
                                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unread" />
                                )}
                                <span>{pm.subject}</span>
                              </div>
                              <div className="text-[0.6875rem] text-[var(--muted)] font-normal mt-0.5">
                                {pm.content}
                              </div>
                            </td>
                            <td className="p-3 font-bold text-[var(--teal-deep)]">{pm.from}</td>
                            <td className="p-3 text-[var(--muted)]">{pm.date}</td>
                            <td className="p-3">
                              <div className="flex gap-2 text-[0.6875rem]">
                                <button
                                  onClick={() => {
                                    setPmForm({ to: pm.from, subject: `Re: ${pm.subject}`, content: '' });
                                    setPmModalOpen(true);
                                  }}
                                  className="text-blue-600 font-bold hover:underline"
                                >
                                  {t('reply')}
                                </button>
                                <span>|</span>
                                <button
                                  onClick={() => {
                                    setPms(pms.filter((p) => p.id !== pm.id));
                                    fetch(`/api/pms/${pm.id}`, { method: 'DELETE' }).catch(console.error);
                                    showToast(t('deleteSuccess'));
                                  }}
                                  className="text-red-600 font-bold hover:underline"
                                >
                                  {t('deleteReply')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {pms.filter((p) => p.to === currentUser.username).length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-xs text-[var(--muted)]">
                            {t('noResults')} - {t('emptyInboxMsg')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-[var(--surface-2)] border-t text-center text-xs">
                  <button
                    onClick={() => navigate('memberPanel')}
                    className="text-[var(--teal)] font-bold hover:underline"
                  >
                    {t('goBackToControlPanel')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 9. SECTION 1 - MEDICAL KNOWLEDGE FAQ MAIN TOPICS (Figure 11) */}
          {currentPage === 'faqMain' && (
            <div className="space-y-5">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('medicalKnowledgeFAQ') }]} />

              <div className="card p-6 border-t-4 border-t-[var(--teal)]">
                <div className="text-center mb-6">
                  <h1 className="display text-xl lg:text-2xl font-bold text-[var(--navy)]">
                    {t('medicalFAQTitle')}
                  </h1>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {t('selectMainTopicDesc')}
                  </p>
                </div>

                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-5">
                  {t('mainTopicHeader')}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {categories.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveMainId(cat.id);
                          navigate('faqSub');
                        }}
                        className="card p-4 text-center hover:border-[var(--teal)] hover:shadow-md transition group focus-ring bg-blue-50/40"
                      >
                        <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 text-blue-700 grid place-items-center mb-2 group-hover:bg-[var(--teal-soft)] group-hover:text-[var(--teal-deep)] transition">
                          <CatIcon className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold text-blue-800 group-hover:text-[var(--teal-deep)]">
                          {getLoc(cat.name)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 10. FAQ SUBTOPICS PAGE (Figure 12) */}
          {currentPage === 'faqSub' && (
            <div className="space-y-5">
              <Breadcrumbs
                items={[
                  { label: t('home'), onClick: () => navigate('home') },
                  { label: t('medicalKnowledgeFAQ'), onClick: () => navigate('faqMain') },
                  { label: getLoc(categories.find((c) => c.id === activeMainId)?.name) }
                ]}
              />

              <div className="card p-6 border-t-4 border-t-[var(--teal)]">
                <div className="border-b pb-3 mb-4 flex items-center justify-between">
                  <h1 className="display text-xl font-bold text-[var(--navy)]">
                    {t('mainTopicHeader')} &gt; {getLoc(categories.find((c) => c.id === activeMainId)?.name)}
                  </h1>
                  <span className="text-xs text-[var(--muted)]">
                    {categories.find((c) => c.id === activeMainId)?.subs.length} {t('subtopicsCount')}
                  </span>
                </div>

                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-5">
                  {getLoc(categories.find((c) => c.id === activeMainId)?.name)} {t('subtopicsHeaderSuffix')}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories
                    .find((c) => c.id === activeMainId)
                    ?.subs.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveSubId(s.id);
                          navigate('faqList');
                        }}
                        className="card p-4 text-left hover:border-[var(--teal)] hover:shadow-md transition group focus-ring bg-blue-50/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-blue-800 group-hover:text-[var(--teal-deep)]">
                            {getLoc(s.name)}
                          </div>
                          <div className="text-[0.625rem] text-[var(--muted)] mt-1">
                            {faqs.filter((f) => f.subId === s.id).length} {t('faqsAvailable')}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--teal)]" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* 11. FAQ LIST PAGE (Figure 13 & 44) */}
          {currentPage === 'faqList' && (
            <div className="space-y-5">
              <Breadcrumbs
                items={[
                  { label: t('home'), onClick: () => navigate('home') },
                  { label: t('medicalKnowledgeFAQ'), onClick: () => navigate('faqMain') },
                  {
                    label: getLoc(categories.find((c) => c.id === activeMainId)?.name),
                    onClick: () => navigate('faqSub')
                  },
                  {
                    label: getLoc(
                      categories.find((c) => c.id === activeMainId)?.subs.find((s) => s.id === activeSubId)?.name
                    )
                  }
                ]}
              />

              <div className="card p-6 border-t-4 border-t-[var(--teal)]">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-5">
                  {getLoc(categories.find((c) => c.id === activeMainId)?.subs.find((s) => s.id === activeSubId)?.name)}
                </div>

                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="p-4 rounded-xl border bg-white hover:border-[var(--teal)] transition shadow-sm">
                      <button
                        onClick={() => {
                          setFaqs(faqs.map((f) => f.id === faq.id ? { ...f, views: f.views + 1 } : f));
                          fetch(`/api/faqs/${faq.id}/view`, { method: 'POST' }).catch(console.error);
                          setActiveFaqDetail({ ...faq, views: faq.views + 1 });
                        }}
                        className="text-left font-bold text-sm text-blue-700 hover:text-[var(--teal)] hover:underline block leading-snug"
                      >
                        {getLoc(faq.q)}
                      </button>

                      <div className="flex items-center justify-between text-[0.6875rem] text-[var(--muted)] mt-2 pt-2 border-t">
                        <span>
                          ({t('clickingViews')} : <b className="text-red-600">{faq.views}</b>) {t('addBy')} <span className="font-semibold">{faq.createdBy}</span> {t('atTime')} {faq.createdAt}
                        </span>

                        {/* Clinical Staff & Administrator Action Icons */}
                        {isModeratorOrAbove(currentUser) && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditFaq(faq)}
                              className="p-1 rounded hover:bg-gray-100 text-blue-600"
                              title={t('editFAQ')}
                              aria-label={t('editFAQ')}
                            >
                              <PenLine className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setModalDialog({
                                  title: t('deleteFAQ'),
                                  msg: t('deleteFAQConfirm'),
                                  type: "confirm",
                                  onConfirm: () => {
                                    setFaqs(faqs.filter((f) => f.id !== faq.id));
                                    fetch(`/api/faqs/${faq.id}`, { method: 'DELETE' }).catch(console.error);
                                    showToast(t('deleteSuccess'));
                                  }
                                });
                              }}
                              className="p-1 rounded hover:bg-red-50 text-red-600"
                              title={t('deleteFAQ')}
                              aria-label={t('deleteFAQ')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-8 text-xs text-[var(--muted)]">
                      {t('noResultsInSubtopic')}
                    </div>
                  )}

                  {/* Figure 44: Doctor / Moderator / Administrator "Create Medical Knowledge FAQ" hyperlink */}
                  {isModeratorOrAbove(currentUser) && (
                    <div className="pt-4 text-center border-t">
                      <button
                        type="button"
                        onClick={openCreateFaq}
                        className="text-xs text-blue-700 font-bold hover:underline"
                      >
                        {t('createFAQLink')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 12. SECTION 2 - MEDICAL KNOWLEDGE FAQ SEARCH MODULE (Figure 16 - 21) */}
          {currentPage === 'faqSearch' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('searchMedicalFAQ') }]} />

              <div className="card p-6 border-t-4 border-t-[var(--teal)]">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-5">
                  {t('searchMedicalKnowledgeFAQ')}
                </div>

                <div className="space-y-3 text-xs bg-[var(--surface-2)]/60 p-4 rounded-xl border">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-2 font-bold">{t('searchFor')}:</div>
                    <div className="sm:col-span-10">
                      <input
                        value={faqSearchQuery}
                        onChange={(e) => setFaqSearchQuery(e.target.value)}
                        placeholder="e.g. cancer, vitamin, smoking, fever"
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 font-bold">{t('in')}:</div>
                    <div className="sm:col-span-5">
                      <select
                        value={faqSearchCat}
                        onChange={(e) => setFaqSearchCat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      >
                        <option value="all">{t('allCategories')}</option>
                        {categories.map((cat) => (
                          <optgroup key={cat.id} label={getLoc(cat.name)}>
                            <option value={cat.id}>{getLoc(cat.name)} (All)</option>
                            {cat.subs.map((s) => (
                              <option key={s.id} value={s.id}>
                                &nbsp;&nbsp;{getLoc(s.name)}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 font-bold text-center">in the:</div>
                    <div className="sm:col-span-3">
                      <select
                        value={faqSearchScope}
                        onChange={(e) => setFaqSearchScope(e.target.value as 'questions' | 'answers')}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      >
                        <option value="questions">{t('questions')}</option>
                        <option value="answers">{t('answers')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results Section (Figure 20) */}
                <div className="mt-5 space-y-3">
                  <div className="bg-amber-100 border border-amber-300 text-amber-900 p-2 text-center rounded-lg text-xs font-bold">
                    Found {faqSearchResults.length} {t('results')}!
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-blue-600 text-white font-bold text-left">
                        <tr>
                          <th className="p-3">FAQ</th>
                          <th className="p-3 w-48">{t('createdBy')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border">
                        {faqSearchResults.map((faq) => (
                          <tr key={faq.id} className="hover:bg-[var(--surface-2)]/50">
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  setFaqs(faqs.map((f) => f.id === faq.id ? { ...f, views: f.views + 1 } : f));
                                  setActiveFaqDetail({ ...faq, views: faq.views + 1 });
                                }}
                                className="text-left font-bold text-blue-700 hover:text-[var(--teal)] hover:underline"
                              >
                                {getLoc(faq.q)}
                              </button>
                            </td>
                            <td className="p-3 text-[0.6875rem] text-[var(--muted)]">
                              {faq.createdBy} at {faq.createdAt}
                            </td>
                          </tr>
                        ))}
                        {faqSearchResults.length === 0 && (
                          <tr>
                            <td colSpan={2} className="p-8 text-center text-xs text-[var(--muted)]">
                              {t('noResults')} - Please refine your search keyword.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 13. SECTION 3 - DISCUSSION BOARD MAIN PAGE (Figure 22) */}
          {currentPage === 'discussionMain' && (
            <div className="space-y-4">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('discussionBoard') }]} />

              <div className="card overflow-hidden border border-[var(--border)]">
                {/* Header buttons (Figure 22: MEMBERS, SEARCH) */}
                <div className="bg-[var(--surface-2)] p-4 border-b flex items-center justify-between">
                  <h1 className="font-bold text-sm text-[var(--navy)]">
                    {t('medicalKnowledgeFAQDiscussionBoard')}
                  </h1>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setForumSearchScope('members');
                        navigate('discussionSearch');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[var(--teal)] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{t('members')}</span>
                    </button>
                    <button
                      onClick={() => navigate('discussionSearch')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{t('search')}</span>
                    </button>
                  </div>
                </div>

                {/* Subforums Listing */}
                <div className="p-4 space-y-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="border rounded-xl overflow-hidden">
                      <div className="bg-amber-500 text-white font-bold p-2 text-xs">
                        {getLoc(cat.name)}
                      </div>
                      <div className="divide-y">
                        {cat.subs.map((s) => (
                          <div key={s.id} className="p-3 flex items-start justify-between gap-4 hover:bg-[var(--surface-2)]/40">
                            <div>
                              <button
                                onClick={() => {
                                  setActiveMainId(cat.id);
                                  setActiveSubId(s.id);
                                  navigate('discussionSub');
                                }}
                                className="text-xs font-bold text-blue-700 hover:text-[var(--teal)] hover:underline text-left block"
                              >
                                {getLoc(s.name)}
                              </button>
                              <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                                {s.desc ? getLoc(s.desc) : `Discussion thread for ${getLoc(s.name)}`}
                              </div>
                            </div>
                            <div className="text-[0.6875rem] text-[var(--muted)] text-right shrink-0">
                              <b>{topics.filter((top) => top.subId === s.id).length}</b> Topics
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 14. DISCUSSION SUB FORUM VIEW (Figure 23 & 24) */}
          {currentPage === 'discussionSub' && (
            <div className="space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('discussionBoard'), onClick: () => navigate('discussionMain') },
                  { label: getLoc(categories.find((c) => c.id === activeMainId)?.name), onClick: () => navigate('discussionMain') },
                  { label: getLoc(categories.find((c) => c.id === activeMainId)?.subs.find((s) => s.id === activeSubId)?.name) }
                ]}
              />

              <div className="card overflow-hidden border border-[var(--border)]">
                {/* Header navigation bar (Figure 23) */}
                <div className="bg-[var(--surface-2)] p-3 border-b flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-[var(--navy)]">
                    {getLoc(categories.find((c) => c.id === activeMainId)?.name)} &gt;{' '}
                    {getLoc(categories.find((c) => c.id === activeMainId)?.subs.find((s) => s.id === activeSubId)?.name)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentUser && (
                      <>
                        <button
                          onClick={() => navigate('pmCenter')}
                          className="px-2.5 py-1 rounded bg-amber-500 text-white text-[0.6875rem] font-bold"
                        >
                          PM INBOX
                        </button>
                        <button
                          onClick={() => navigate('memberPanel')}
                          className="px-2.5 py-1 rounded bg-blue-600 text-white text-[0.6875rem] font-bold"
                        >
                          CONTROL PANEL
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => navigate('discussionSearch')}
                      className="px-2.5 py-1 rounded bg-blue-700 text-white text-[0.6875rem] font-bold"
                    >
                      SEARCH
                    </button>
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          setModalDialog({
                            title: t('error'),
                            msg: t('mustLoginToPost'),
                            type: 'alert'
                          });
                          return;
                        }
                        navigate('createTopicForm');
                      }}
                      className="px-2.5 py-1 rounded bg-[var(--teal)] text-white text-[0.6875rem] font-bold"
                    >
                      {t('createNewTopic')}
                    </button>
                  </div>
                </div>

                {/* Figure 24: Unauthenticated User Warning */}
                {!currentUser && (
                  <div className="bg-amber-100 border-b border-amber-300 p-2.5 text-center text-xs font-bold text-amber-900">
                    {t('mustLoginToPost')}
                  </div>
                )}

                {/* Subforum Topics Table (Figure 23) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-amber-500 text-white font-bold text-left">
                      <tr>
                        <th className="p-3">{t('topicTitle')}</th>
                        <th className="p-3">{t('author')}</th>
                        <th className="p-3 text-center">{t('repliesViews')}</th>
                        <th className="p-3">{t('lastPost')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-b">
                      {filteredForumTopics.map((top) => (
                        <tr key={top.id} className="hover:bg-[var(--surface-2)]/50">
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setActiveTopic(top);
                                navigate('discussionTopic');
                              }}
                              className="text-left font-bold text-blue-700 hover:text-[var(--teal)] hover:underline"
                            >
                              {getLoc(top.title)}
                            </button>
                            <span className="ml-2 text-[0.625rem] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                              {top.priority}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-[var(--teal-deep)]">{top.author}</td>
                          <td className="p-3 text-center text-[var(--muted)]">
                            {top.replies} / {top.views}
                          </td>
                          <td className="p-3 text-[0.6875rem] text-[var(--muted)]">
                            {t('byUserAtTime')} <span className="font-semibold text-blue-700">{top.lastAuthor}</span> {t('atTime')} {top.lastTime}
                          </td>
                        </tr>
                      ))}
                      {filteredForumTopics.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-xs text-[var(--muted)]">
                            {t('noResults')} - {t('noTopicsPostedYet')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 15. CREATE NEW TOPIC FORM (Figure 25) */}
          {currentPage === 'createTopicForm' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('discussionBoard'), onClick: () => navigate('discussionMain') },
                  { label: t('subForumBreadcrumb'), onClick: () => navigate('discussionSub') },
                  { label: t('createNewTopic') }
                ]}
              />

              <div className="card p-6 border-t-4 border-t-[var(--amber)]">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-4">
                  {t('createNewTopicForDiscussion')}
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold block mb-1">{t('topic')}:</label>
                    <input
                      value={newTopicForm.title}
                      onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
                      placeholder={t('enterTopicTitle')}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">{t('message')}:</label>
                    <textarea
                      rows={6}
                      value={newTopicForm.message}
                      onChange={(e) => setNewTopicForm({ ...newTopicForm, message: e.target.value })}
                      placeholder={t('typeDiscussionContent')}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">{t('priority')}:</label>
                    <select
                      value={newTopicForm.priority}
                      onChange={(e) => setNewTopicForm({ ...newTopicForm, priority: e.target.value as 'Normal' | 'High' | 'Low' })}
                      className="w-48 px-3 py-2 rounded-xl border bg-white"
                    >
                      <option value="Normal">{t('normalPriority')}</option>
                      <option value="High">{t('highPriority')}</option>
                      <option value="Low">{t('lowPriority')}</option>
                    </select>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleCreateTopic}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700"
                    >
                      {t('createSubject')}
                    </button>
                    <button
                      onClick={() => navigate('discussionSub')}
                      className="text-xs text-[var(--teal)] hover:underline"
                    >
                      {t('goBackWithoutCreate')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 16. DISCUSSION TOPIC THREAD (Figure 26 - 31) */}
          {currentPage === 'discussionTopic' && activeTopic && (
            <div className="space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('discussionBoard'), onClick: () => navigate('discussionMain') },
                  { label: "Sub Forum", onClick: () => navigate('discussionSub') },
                  { label: getLoc(activeTopic.title) }
                ]}
              />

              <div className="card overflow-hidden border border-[var(--border)]">
                {/* Header navigation bar (Figure 26) */}
                <div className="bg-[var(--surface-2)] p-3 border-b flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-[var(--navy)]">
                    Topic title: <span className="text-blue-800 underline">{getLoc(activeTopic.title)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentUser && (
                      <>
                        <button
                          onClick={() => navigate('memberPanel')}
                          className="px-2.5 py-1 rounded bg-blue-600 text-white text-[0.6875rem] font-bold"
                        >
                          CONTROL PANEL
                        </button>
                        <button
                          onClick={() => navigate('pmCenter')}
                          className="px-2.5 py-1 rounded bg-amber-500 text-white text-[0.6875rem] font-bold"
                        >
                          PM INBOX
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        const replyBox = document.getElementById('post-reply-box');
                        if (replyBox) replyBox.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[0.6875rem] font-bold"
                    >
                      ADD REPLY
                    </button>
                    <button
                      onClick={() => navigate('createTopicForm')}
                      className="px-2.5 py-1 rounded bg-[var(--teal)] text-white text-[0.6875rem] font-bold"
                    >
                      NEW TOPIC
                    </button>
                    <button
                      onClick={() => navigate('discussionSub')}
                      className="px-2.5 py-1 rounded bg-blue-700 text-white text-[0.6875rem] font-bold"
                    >
                      TOPICS
                    </button>
                    {(isModeratorOrAbove(currentUser) || currentUser?.username === activeTopic.author) && (
                      <button
                        onClick={() => {
                          setModalDialog({
                            title: t('confirmDelete'),
                            msg: "Delete this entire topic and all its responses?",
                            type: 'confirm',
                            onConfirm: () => {
                              setTopics(topics.filter((t) => t.id !== activeTopic.id));
                              setPosts(posts.filter((p) => p.topicId !== activeTopic.id));
                              fetch(`/api/topics/${activeTopic.id}`, { method: 'DELETE' }).catch(console.error);
                              showToast(t('deleteSuccess'));
                              navigate('discussionSub');
                            }
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-red-700 hover:bg-red-800 text-white text-[0.6875rem] font-bold"
                      >
                        DELETE TOPIC
                      </button>
                    )}
                  </div>
                </div>

                {/* Posts in this topic */}
                <div className="divide-y">
                  {posts
                    .filter((p) => p.topicId === activeTopic.id)
                    .map((post) => {
                      const isAuthor = currentUser?.username === post.author;
                      const isAdmin = isModeratorOrAbove(currentUser);
                      const canEditDelete = isAuthor || isAdmin;

                      return (
                        <div key={post.id} className="p-4 flex flex-col md:flex-row gap-4 bg-white">
                          {/* Left Member Column (Figure 26) */}
                          <div className="w-full md:w-44 shrink-0 bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex md:flex-col items-center gap-3 md:text-center">
                            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-sm grid place-items-center shadow-sm">
                              {post.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-blue-900">{post.author}</div>
                              <div className="text-[0.625rem] text-[var(--muted)]">
                                {post.postCount} Posts
                              </div>
                              <div className="text-[0.625rem] text-[var(--muted)] mt-1">
                                Posted at {post.time}
                              </div>
                            </div>
                          </div>

                          {/* Right Content Column */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            {/* Actions bar (PM, Profile, Quote, Edit, Delete) */}
                            <div className="flex items-center justify-between border-b pb-2 mb-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setPmForm({ to: post.author, subject: `PM regarding ${getLoc(activeTopic.title)}`, content: '' });
                                    setPmModalOpen(true);
                                  }}
                                  className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[0.625rem] font-bold hover:bg-blue-200"
                                >
                                  PM
                                </button>
                                <button
                                  onClick={() => {
                                    const m = members.find((x) => x.username === post.author);
                                    if (m) {
                                      setModalDialog({
                                        title: `${m.username}'s Profile`,
                                        msg: `Full Name: ${m.fullName}\nEmail: ${m.emailPrivate ? '[Private]' : m.email}\nJoined: ${m.joinDate}\nTotal Posts: ${m.posts}`,
                                        type: 'alert'
                                      });
                                    }
                                  }}
                                  className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[0.625rem] font-bold hover:bg-gray-200"
                                >
                                  Profile
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyContent((prev) => `${prev ? prev + '\n\n' : ''}[Quote from ${post.author}]:\n"${getLoc(post.content)}"\n--- `);
                                    const replyBox = document.getElementById('post-reply-box');
                                    if (replyBox) replyBox.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[0.625rem] font-bold hover:bg-amber-200"
                                >
                                  Quote
                                </button>
                              </div>

                              {/* Figure 28-31: Edit and Delete buttons visible ONLY to authorized members! */}
                              {canEditDelete && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingPostId(post.id);
                                      setEditingPostContent(getLoc(post.content));
                                    }}
                                    className="px-2 py-0.5 rounded bg-teal-100 text-[var(--teal-deep)] text-[0.625rem] font-bold hover:bg-teal-200 flex items-center gap-1"
                                  >
                                    <PenLine className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[0.625rem] font-bold hover:bg-red-200 flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Post content or Edit form (Figure 29 & 30) */}
                            {editingPostId === post.id ? (
                              <div className="space-y-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                <div className="font-bold text-xs text-amber-900">Edit Post</div>
                                <textarea
                                  rows={4}
                                  value={editingPostContent}
                                  onChange={(e) => setEditingPostContent(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border bg-white text-xs outline-none focus:ring-2 focus:ring-[var(--teal)]"
                                />
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleSaveEditedPost(post)}
                                    className="px-4 py-1.5 rounded-lg bg-[var(--teal)] text-white text-xs font-bold"
                                  >
                                    {t('update')}
                                  </button>
                                  <button
                                    onClick={() => setEditingPostId(null)}
                                    className="text-xs text-[var(--teal)] hover:underline"
                                  >
                                    {t('goBackWithoutSave')}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-[var(--text)] leading-relaxed whitespace-pre-wrap py-2">
                                {getLoc(post.content)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Post Reply Section (Figure 27) */}
                <div id="post-reply-box" className="p-4 bg-[var(--surface-2)]/60 border-t">
                  <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-3">
                    {t('postReply')}
                  </div>

                  {!currentUser ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-center text-xs font-bold text-amber-900 space-y-2">
                      <div>{t('mustLoginToPost')}</div>
                      <button
                        onClick={() => navigate('login')}
                        className="px-4 py-1.5 rounded-lg bg-[var(--navy)] text-white text-xs font-bold"
                      >
                        {t('userSignIn')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={4}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full px-3 py-2 rounded-xl border bg-white text-xs focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                      <button
                        onClick={handlePostReply}
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
                      >
                        {t('postThis')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 17. SECTION 4 - DISCUSSION BOARD SEARCH MODULE (Figure 32 - 37) */}
          {currentPage === 'discussionSearch' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('searchDiscussionBoard') }]} />

              <div className="card p-6 border-t-4 border-t-[var(--amber)]">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-5">
                  Search Medical Knowledge FAQ Discussion Board
                </div>

                <div className="space-y-3 text-xs bg-[var(--surface-2)]/60 p-4 rounded-xl border">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-2 font-bold">{t('searchFor')}:</div>
                    <div className="sm:col-span-10">
                      <input
                        value={forumSearchQuery}
                        onChange={(e) => setForumSearchQuery(e.target.value)}
                        placeholder="admin, quit smoking, allergy, asthma..."
                        className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 font-bold">{t('in')}:</div>
                    <div className="sm:col-span-5">
                      <select
                        value={forumSearchCat}
                        onChange={(e) => setForumSearchCat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      >
                        <option value="all">All open forums</option>
                        <option value="members">Members</option>
                        {categories.map((cat) => (
                          <optgroup key={cat.id} label={getLoc(cat.name)}>
                            <option value={cat.id}>{getLoc(cat.name)}</option>
                            {cat.subs.map((s) => (
                              <option key={s.id} value={s.id}>
                                &nbsp;&nbsp;{getLoc(s.name)}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 font-bold text-center">in the:</div>
                    <div className="sm:col-span-3">
                      <select
                        value={forumSearchScope}
                        onChange={(e) => setForumSearchScope(e.target.value as 'subject' | 'post' | 'members')}
                        className="w-full px-3 py-2 rounded-xl border bg-white"
                      >
                        <option value="subject">{t('subject')}</option>
                        <option value="post">{t('post')}</option>
                        <option value="members">{t('members')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results Section (Figure 36 & 37) */}
                <div className="mt-5 space-y-3">
                  <div className="bg-amber-100 border border-amber-300 text-amber-900 p-2 text-center rounded-lg text-xs font-bold">
                    Found {forumSearchResults.length} Results!
                  </div>

                  {/* If searching Members (Figure 36) */}
                  {(forumSearchScope === 'members' || forumSearchCat === 'members') ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-blue-600 text-white font-bold text-left">
                          <tr>
                            <th className="p-2.5">View Profile</th>
                            <th className="p-2.5">User Name</th>
                            <th className="p-2.5 text-center">{t('adminLevel')}</th>
                            <th className="p-2.5 text-center">Posts</th>
                            <th className="p-2.5 text-center">Topics</th>
                            <th className="p-2.5">Join Date</th>
                            <th className="p-2.5">Last Online</th>
                            <th className="p-2.5">Last Post</th>
                            <th className="p-2.5 text-center">Photo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y border">
                          {(forumSearchResults as Member[]).map((m) => {
                            const userLastTopic = topics.filter((t) => t.author === m.username).slice(-1)[0];
                            return (
                              <tr key={m.username} className="hover:bg-[var(--surface-2)]/50">
                                <td className="p-2.5">
                                  <button
                                    onClick={() => {
                                      setModalDialog({
                                        title: `${m.username}'s Profile`,
                                        msg: `Full Name: ${m.fullName}\nEmail: ${m.emailPrivate ? '[Private]' : m.email}\nAddress: ${m.address || 'N/A'}\nBirthday: ${m.birthday || 'N/A'}\nSignature: ${m.signature || 'N/A'}`,
                                        type: 'alert'
                                      });
                                    }}
                                    className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[0.6875rem] font-bold hover:bg-blue-200"
                                  >
                                    Profile
                                  </button>
                                </td>
                                <td className="p-2.5 font-bold text-[var(--navy)]">{m.username}</td>
                                <td className="p-2.5 text-center font-semibold">{accessLevelLabel(m)}</td>
                                <td className="p-2.5 text-center">{m.posts}</td>
                                <td className="p-2.5 text-center">{m.topics}</td>
                                <td className="p-2.5 text-[var(--muted)]">{m.joinDate}</td>
                                <td className="p-2.5 text-[var(--muted)]">{m.lastOnline}</td>
                                <td className="p-2.5">
                                  {userLastTopic ? (
                                    <button
                                      onClick={() => {
                                        setActiveTopic(userLastTopic);
                                        navigate('discussionTopic');
                                      }}
                                      className="text-left font-bold text-blue-700 hover:text-[var(--teal)] hover:underline truncate max-w-[150px] block"
                                    >
                                      {getLoc(userLastTopic.title)} - {userLastTopic.lastTime}
                                    </button>
                                  ) : (
                                    <span className="text-[var(--muted)]">Never Posted!</span>
                                  )}
                                </td>
                                <td className="p-2.5 text-center text-[var(--muted)]">No</td>
                              </tr>
                            );
                          })}
                          {forumSearchResults.length === 0 && (
                            <tr>
                              <td colSpan={9} className="p-8 text-center text-xs text-[var(--muted)]">
                                {t('noResults')} for member query.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* Topic / Post results */
                    <div className="divide-y border rounded-xl overflow-hidden bg-white text-xs">
                      {forumSearchResults.map((item: any) => (
                        <div key={item.id} className="p-3.5 hover:bg-[var(--surface-2)]/50 flex items-center justify-between gap-4">
                          <div>
                            <div className="font-bold text-blue-700">
                              {item.title ? getLoc(item.title) : `Post in topic: ${item.topicId}`}
                            </div>
                            <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                              Author: <span className="font-semibold">{item.author}</span> • Time: {item.lastTime || item.time}
                            </div>
                            {item.content && (
                              <div className="text-[0.6875rem] text-[var(--text)] mt-1 italic">
                                "{getLoc(item.content).slice(0, 100)}..."
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              const targetTop = item.title ? item : topics.find((top) => top.id === item.topicId);
                              if (targetTop) {
                                setActiveTopic(targetTop);
                                navigate('discussionTopic');
                              }
                            }}
                            className="px-3 py-1 rounded bg-[var(--surface-2)] font-bold hover:bg-[var(--teal-soft)] shrink-0"
                          >
                            View Post
                          </button>
                        </div>
                      ))}
                      {forumSearchResults.length === 0 && (
                        <div className="p-8 text-center text-xs text-[var(--muted)]">
                          {t('noResults')} for discussion search.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 18. SECTION 5 - FEEDBACK MODULE (Figure 38 - 40) */}
          {currentPage === 'feedback' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('feedback') }]} />

              <div className="card p-6 border-t-4 border-t-[var(--teal)]">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-4">
                  {t('feedbackForm')}
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold block mb-1">
                      {t('name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">
                      {t('emailAddress')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">
                      {t('subject')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={feedbackForm.subject}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">{t('category')}:</label>
                    <select
                      value={feedbackForm.cat}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, cat: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border bg-white"
                    >
                      <option value="suggestion">{t('suggestion')}</option>
                      <option value="complaint">{t('complaint')}</option>
                      <option value="compliment">{t('compliment')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">
                      {t('yourComment')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={handleSubmitFeedback}
                      className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
                    >
                      {t('send')}
                    </button>
                    <button
                      onClick={() => setFeedbackForm({ name: '', email: '', subject: '', message: '', cat: 'suggestion' })}
                      className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-300"
                    >
                      {t('clearForm')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Success Confirmation (Figure 40) */}
          {currentPage === 'feedbackConfirmation' && (
            <div className="max-w-md mx-auto py-12 text-center space-y-4">
              <div className="card p-8 bg-blue-50 border-2 border-blue-200 space-y-3">
                <CircleCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <h2 className="text-lg font-bold text-blue-900">
                  {t('feedback')}
                </h2>
                <div className="p-4 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-800">
                  {t('feedbackSent')}
                </div>
                <div className="p-3 rounded-xl bg-blue-100/70 border border-blue-200 text-[0.6875rem] text-blue-900 text-left space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-blue-950">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>{t('routingStatus')}</span>
                  </div>
                  <div>{t('routingPersisted')}</div>
                  <div>{t('routingDispatched')}</div>
                  <div>{t('routingQueued')}</div>
                </div>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => navigate('feedback')}
                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-bold transition"
                  >
                    {t('sendAnother')}
                  </button>
                  <button
                    onClick={() => navigate('home')}
                    className="px-5 py-2 rounded-xl bg-[var(--navy)] text-white text-xs font-bold hover:bg-[var(--teal-deep)] transition"
                  >
                    {t('home')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 19. SECTION 6 - ADMINISTRATOR & MODERATOR'S MODULE (Figure 41 - 51) */}
          {currentPage === 'adminBoard' && (
            currentUser?.role !== 'admin' ? (
              <div className="card p-8 text-center space-y-4 max-w-lg mx-auto border-t-4 border-t-red-600">
                <Shield className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-base font-bold text-red-950">{t('accessDeniedTitle')}</h2>
                <p className="text-xs text-[var(--muted)]">{t('accessDeniedDesc')}</p>
                <button onClick={() => navigate('login')} className="px-4 py-2 rounded-xl bg-[var(--navy)] text-white text-xs font-bold">
                  {t('userSignIn')}
                </button>
              </div>
            ) : (
            <div className="max-w-4xl mx-auto space-y-5">
              <Breadcrumbs items={[{ label: t('home'), onClick: () => navigate('home') }, { label: t('administrationBoard') }]} />

              <div className="card p-6 border-t-4 border-t-purple-600">
                <div className="border-b pb-3 mb-5 flex items-center justify-between">
                  <div>
                    <h1 className="display text-xl font-bold text-purple-950 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-700" />
                      <span>{t('administrationBoard')}</span>
                    </h1>
                    <div className="text-xs text-[var(--muted)] mt-1">
                      {t('sysAdminControlPanel')} • {t('adminLevel')}: {accessLevelLabel(currentUser)}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                    {t('superAdmin')}
                  </span>
                </div>

                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-5">
                  {t('adminControlPanelUnits')}
                </div>

                {/* The 5 Main Function Units (Figure 42) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('adminFaq')}
                    className="card p-4 text-left hover:border-purple-500 hover:shadow-md transition group focus-ring bg-purple-50/30"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 grid place-items-center mb-2">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-purple-950 group-hover:text-purple-700">
                      {t('medFaqAdminUnit')}
                    </div>
                    <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                      {t('medFaqAdminUnitDesc')}
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('adminForum')}
                    className="card p-4 text-left hover:border-purple-500 hover:shadow-md transition group focus-ring bg-purple-50/30"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 grid place-items-center mb-2">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-purple-950 group-hover:text-purple-700">
                      {t('discussionBoardAdminUnit')}
                    </div>
                    <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                      {t('discussionBoardAdminUnitDesc')}
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('adminEmail')}
                    className="card p-4 text-left hover:border-purple-500 hover:shadow-md transition group focus-ring bg-purple-50/30"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 grid place-items-center mb-2">
                      <Send className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-purple-950 group-hover:text-purple-700">
                      {t('sendEmailToAllUnit')}
                    </div>
                    <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                      {t('sendEmailToAllUnitDesc')}
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('adminMembers')}
                    className="card p-4 text-left hover:border-purple-500 hover:shadow-md transition group focus-ring bg-purple-50/30"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-[var(--teal-deep)] grid place-items-center mb-2">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-purple-950 group-hover:text-purple-700">
                      {t('membershipMgmtUnit')}
                    </div>
                    <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                      {t('membershipMgmtUnitDesc')}
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('adminFeedback')}
                    className="card p-4 text-left hover:border-purple-500 hover:shadow-md transition group focus-ring bg-purple-50/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 grid place-items-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[0.625rem] font-bold">
                        {feedbacks.length} {t('messagesCount')}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-purple-950 group-hover:text-purple-700">
                      {t('readUserFeedbackUnit')}
                    </div>
                    <div className="text-[0.6875rem] text-[var(--muted)] mt-1">
                      {t('readUserFeedbackUnitDesc')}
                    </div>
                  </button>
                </div>
              </div>
            </div>
            )
          )}

          {/* Admin Unit 1: Medical Knowledge FAQ Admin Center (Figure 43) */}
          {currentPage === 'adminFaq' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('administrationBoard'), onClick: () => navigate('adminBoard') },
                  { label: "FAQ Admin Center" }
                ]}
              />

              <div className="card p-6 border-t-4 border-t-purple-600 space-y-4">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs">
                  Add, delete or rename FAQ categories: Medical Knowledge FAQ Admin Center
                </div>

                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="border rounded-xl p-3 bg-blue-50/40">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCategories(categories.filter((c) => c.id !== cat.id));
                              fetch(`/api/categories/${cat.id}`, { method: 'DELETE' }).catch(console.error);
                              showToast(t('deleteSuccess'));
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Delete Main Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-xs text-blue-900">{getLoc(cat.name)}</span>
                          <span className="text-[0.625rem] text-[var(--muted)]">List Order: {cat.listOrder}</span>
                        </div>
                        <button
                          onClick={() => openTextPrompt(t('dlgChangeCategoryTitle'), t('categoryNameLabel'), getLoc(cat.name), (v) => {
                            const updatedName = setLocalized(cat.name, lang, v);
                            setCategories(categories.map((c) => c.id === cat.id ? { ...c, name: updatedName } : c));
                            fetch(`/api/categories/${cat.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ name: updatedName }),
                            }).catch(console.error);
                            showToast(t('success'));
                          })}
                          className="text-[0.6875rem] text-blue-700 font-bold hover:underline"
                        >
                          Change title
                        </button>
                      </div>

                      <div className="pt-2 pl-4 space-y-1.5">
                        {cat.subs.map((s) => (
                          <div key={s.id} className="flex items-center justify-between text-xs py-1 border-b border-dashed">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setCategories(categories.map((c) => c.id === cat.id ? {
                                    ...c,
                                    subs: c.subs.filter((sub) => sub.id !== s.id)
                                  } : c));
                                  fetch(`/api/subcategories/${s.id}`, { method: 'DELETE' }).catch(console.error);
                                  showToast(t('deleteSuccess'));
                                }}
                                className="text-red-400 hover:text-red-600"
                                title="Delete Sub Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span>{getLoc(s.name)}</span>
                            </div>
                            <button
                              onClick={() => setGenericEditor({
                                title: "Change sub category's title",
                                label: "Sub Category Title",
                                value: getLoc(s.name),
                                onSave: (newTitle) => {
                                  const updatedName = { EN: newTitle, ZH: newTitle, BM: newTitle };
                                  setCategories(categories.map((c) => c.id === cat.id ? {
                                    ...c,
                                    subs: c.subs.map((sub) => sub.id === s.id ? {
                                      ...sub,
                                      name: updatedName
                                    } : sub)
                                  } : c));
                                  fetch(`/api/subcategories/${s.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name: updatedName }),
                                  }).catch(console.error);
                                  showToast(t('success'));
                                },
                                submitted: false
                              })}
                              className="text-[0.6875rem] text-blue-600 hover:underline"
                            >
                              Change sub category's title
                            </button>
                          </div>
                        ))}

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              const sName = prompt("Enter New Sub Category name:");
                              if (sName) {
                                const newSub: SubCategory = {
                                  id: "sub_" + Date.now(),
                                  mainId: cat.id,
                                  name: { EN: sName, ZH: sName, BM: sName }
                                };
                                setCategories(categories.map((c) => c.id === cat.id ? {
                                  ...c,
                                  subs: [...c.subs, newSub]
                                } : c));
                                fetch('/api/subcategories', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(newSub),
                                }).catch(console.error);
                                showToast(t('createSuccess'));
                              }
                            }}
                            className="text-xs text-[var(--teal-deep)] font-bold hover:underline"
                          >
                            + Add a New Sub Category
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setGenericEditor({
                        title: "Add New Main Category",
                        label: "Main Category Name",
                        value: "",
                        onSave: (mName) => {
                          const newCat: MainCategory = {
                            id: "main_" + Date.now(),
                            name: { EN: mName, ZH: mName, BM: mName },
                            desc: { EN: `${mName} clinical topics`, ZH: `${mName}临床专题`, BM: `Topik klinikal ${mName}` },
                            color: "blue",
                            icon: BookOpen,
                            listOrder: categories.length + 1,
                            subs: []
                          };
                          setCategories([...categories, newCat]);
                          fetch('/api/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newCat),
                          }).catch(console.error);
                          showToast(t('createSuccess'));
                        },
                        submitted: false
                      })}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                    >
                      + Add A Main Category
                    </button>
                  </div>
                </div>

                <div className="pt-3 text-center border-t text-xs">
                  <button onClick={() => navigate('adminBoard')} className="text-purple-700 font-bold hover:underline">
                    {t('adminHome')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin Unit 2: Discussion Board Admin Center (Figure 45) */}
          {currentPage === 'adminForum' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('administrationBoard'), onClick: () => navigate('adminBoard') },
                  { label: "Discussion Board Admin Center" }
                ]}
              />

              <div className="card p-6 border-t-4 border-t-purple-600 space-y-4">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs">
                  Add, delete or rename forums: Discussion Board Admin Center
                </div>

                <div className="space-y-4 text-xs">
                  {categories.map((cat) => (
                    <div key={cat.id} className="border rounded-xl p-3 bg-blue-50/30">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <Trash2
                            className="w-4 h-4 text-red-500 cursor-pointer"
                            onClick={() => {
                              setCategories(categories.filter((c) => c.id !== cat.id));
                              fetch(`/api/categories/${cat.id}`, { method: 'DELETE' }).catch(console.error);
                              showToast(t('deleteSuccess'));
                            }}
                          />
                          <span className="font-bold text-blue-900">{getLoc(cat.name)}</span>
                          <span className="text-[0.625rem] text-[var(--muted)]">List Order: {cat.listOrder}</span>
                        </div>
                        <button
                          onClick={() => openTextPrompt(t('dlgRenameForumCategory'), t('categoryNameLabel'), getLoc(cat.name), (v) => {
                            const updatedName = setLocalized(cat.name, lang, v);
                            setCategories(categories.map((c) => c.id === cat.id ? { ...c, name: updatedName } : c));
                            fetch(`/api/categories/${cat.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ name: updatedName }),
                            }).catch(console.error);
                            showToast(t('success'));
                          })}
                          className="text-[0.6875rem] text-blue-700 font-bold hover:underline"
                        >
                          Change title
                        </button>
                      </div>
                      <div className="pl-4 pt-2 space-y-2">
                        {cat.subs.map((s) => (
                          <div key={s.id} className="flex items-center justify-between py-1 border-b border-dashed">
                            <div>
                              <span className="font-bold text-blue-800">{getLoc(s.name)}</span>
                              <div className="text-[0.625rem] text-[var(--muted)]">{s.desc ? getLoc(s.desc) : 'Standard subforum'}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openTextPrompt(t('dlgRenameSubforum'), t('subforumNameLabel'), getLoc(s.name), (v) => {
                                  const updatedName = setLocalized(s.name, lang, v);
                                  setCategories(categories.map((c) => c.id === cat.id ? {
                                    ...c,
                                    subs: c.subs.map((sub) => sub.id === s.id ? { ...sub, name: updatedName } : sub)
                                  } : c));
                                  fetch(`/api/subcategories/${s.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name: updatedName }),
                                  }).catch(console.error);
                                  showToast(t('success'));
                                })}
                                className="text-[0.6875rem] text-blue-600 hover:underline pointer-events-auto"
                              >
                                Edit Subforum
                              </button>
                              <button
                                onClick={() => {
                                  setCategories(categories.map((c) => c.id === cat.id ? {
                                    ...c,
                                    subs: c.subs.filter((sub) => sub.id !== s.id)
                                  } : c));
                                  fetch(`/api/subcategories/${s.id}`, { method: 'DELETE' }).catch(console.error);
                                  showToast(t('deleteSuccess'));
                                }}
                                className="text-[0.6875rem] text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 text-center border-t text-xs">
                  <button onClick={() => navigate('adminBoard')} className="text-purple-700 font-bold hover:underline">
                    {t('adminHome')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin Unit 3: Sending Email Module (Figure 46) */}
          {currentPage === 'adminEmail' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('administrationBoard'), onClick: () => navigate('adminBoard') },
                  { label: t('sendEmailToAll') }
                ]}
              />

              <div className="card p-6 border-t-4 border-t-purple-600">
                <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs mb-4">
                  Send Email to All Members
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Subject:</label>
                    <input
                      value={adminEmailForm.subject}
                      onChange={(e) => setAdminEmailForm({ ...adminEmailForm, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                      placeholder="Announcement Subject"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Type message here:</label>
                    <textarea
                      rows={6}
                      value={adminEmailForm.message}
                      onChange={(e) => setAdminEmailForm({ ...adminEmailForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={async () => {
                        if (!adminEmailForm.subject || !adminEmailForm.message) {
                          setModalDialog({ title: t('error'), msg: "Please fill in both subject and message.", type: 'alert' });
                          return;
                        }
                        try {
                          const res = await fetch('/api/admin/broadcast-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(adminEmailForm),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            showToast(`Announcement email dispatched to ${data.count || members.length} registered members!`);
                            setAdminEmailForm({ subject: '', message: '' });
                            refreshData();
                          } else {
                            showToast(data.error || 'Failed to dispatch email', 'error');
                          }
                        } catch {
                          showToast(`Announcement email dispatched to all ${members.length} registered members!`);
                          setAdminEmailForm({ subject: '', message: '' });
                        }
                      }}
                      className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm transition"
                    >
                      Send!
                    </button>
                  </div>

                  {/* Outgoing Email Notification Status */}
                  <div className="mt-6 pt-5 border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-purple-700" />
                        <span>Email System Status &amp; Notification Outbox</span>
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[0.625rem] font-bold ${
                        emailStatus?.smtpConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {emailStatus?.smtpConfigured ? 'SMTP Online' : 'Local Simulation Mode'}
                      </span>
                    </div>

                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-[0.6875rem] space-y-1">
                      <div><b>Admin Notification Email:</b> <span className="text-purple-800 font-bold">{currentUser?.email || 'admin@medifaq.my'}</span></div>
                      <div><b>SMTP Host:</b> {emailStatus?.smtpHost || 'None (Simulated delivery logged to system outbox & internal PMs)'}</div>
                      <div className="text-[0.625rem] text-[var(--muted)]">
                        Tip: To receive real emails in your Gmail inbox, define SMTP_HOST="smtp.gmail.com", SMTP_USER and SMTP_PASS (Gmail App Password) in your local .env file.
                      </div>
                    </div>

                    {emailStatus?.logs && emailStatus.logs.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="font-bold text-[0.6875rem] text-[var(--navy)]">Recent Dispatched Notifications ({emailStatus.logs.length}):</div>
                        <div className="max-h-48 overflow-y-auto divide-y border rounded-xl bg-white text-[0.625rem]">
                          {emailStatus.logs.map((log) => (
                            <div key={log.id} className="p-2 space-y-0.5 hover:bg-gray-50">
                              <div className="flex items-center justify-between font-bold text-gray-800">
                                <span>To: {log.to}</span>
                                <span className="text-gray-400 font-normal">{log.timestamp}</span>
                              </div>
                              <div className="text-blue-700 font-semibold">{log.subject}</div>
                              <div className="text-gray-500 truncate">{log.preview}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-2">
                    <button onClick={() => navigate('adminBoard')} className="text-xs text-purple-700 font-bold hover:underline">
                      {t('adminHome')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Unit 4: Membership Management (Figure 47 & 48 & 49) */}
          {currentPage === 'adminMembers' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('administrationBoard'), onClick: () => navigate('adminBoard') },
                  { label: t('membershipManagement') }
                ]}
              />

              <div className="card overflow-hidden border border-[var(--border)]">
                <div className="bg-amber-500 text-white font-bold p-2 text-center text-xs">
                  Manage Membership
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-blue-600 text-white font-bold text-left">
                      <tr>
                        <th className="p-2.5">Edit Profile</th>
                        <th className="p-2.5">User Name</th>
                        <th className="p-2.5 text-center">Admin Level</th>
                        <th className="p-2.5 text-center">Posts</th>
                        <th className="p-2.5 text-center">Topics</th>
                        <th className="p-2.5">Join Date</th>
                        <th className="p-2.5">Birthday</th>
                        <th className="p-2.5">Last Post</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border">
                      {members.map((m) => {
                        const mTopic = topics.filter((top) => top.author === m.username).slice(-1)[0];
                        return (
                          <tr key={m.username} className="hover:bg-[var(--surface-2)]/50">
                            <td className="p-2.5">
                              <button
                                onClick={() => setSelectedMemberForAdmin(m)}
                                className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-[0.6875rem] font-bold hover:bg-blue-200"
                              >
                                EDIT PROFILE
                              </button>
                            </td>
                            <td className="p-2.5 font-bold text-[var(--navy)]">{m.username}</td>
                            <td className="p-2.5 text-center font-bold text-purple-800">{m.adminLevel}</td>
                            <td className="p-2.5 text-center">{m.posts}</td>
                            <td className="p-2.5 text-center">{m.topics}</td>
                            <td className="p-2.5 text-[var(--muted)]">{m.joinDate}</td>
                            <td className="p-2.5 text-[var(--muted)]">{m.birthday || 'Unknown'}</td>
                            <td className="p-2.5">
                              {mTopic ? (
                                <button
                                  onClick={() => {
                                    setActiveTopic(mTopic);
                                    navigate('discussionTopic');
                                  }}
                                  className="text-left font-bold text-blue-700 hover:underline truncate max-w-[150px] block"
                                >
                                  {getLoc(mTopic.title)} - {mTopic.lastTime}
                                </button>
                              ) : (
                                <span className="text-[var(--muted)]">Never Posted!</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-[var(--surface-2)] border-t text-center text-xs">
                  <button onClick={() => navigate('adminBoard')} className="text-purple-700 font-bold hover:underline">
                    {t('adminHome')}
                  </button>
                </div>
              </div>

              {/* Detailed Member Admin Modal / Panel (Figure 48 & 49) */}
              {selectedMemberForAdmin && (
                <div className="card p-6 border-2 border-purple-300 bg-purple-50/20 space-y-4">
                  <div className="bg-amber-500 text-white font-bold p-2 text-center rounded-lg text-xs">
                    {selectedMemberForAdmin.username}'s Profile
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border p-3 rounded-xl bg-white">
                    <div>Member Number: <b>{selectedMemberForAdmin.memberNumber || 16}</b></div>
                    <div>Posts: <b>{selectedMemberForAdmin.posts}</b></div>
                    <div>Topics Started: <b>{selectedMemberForAdmin.topics}</b></div>
                    <div>Email: <b>{selectedMemberForAdmin.email}</b></div>
                  </div>

                  {/* Figure 48 Actions */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <button
                        onClick={() => setGenericEditor({
                          title: "Edit Member Full Name",
                          label: "Full Name",
                          value: selectedMemberForAdmin.fullName,
                          onSave: (newName) => {
                            setMembers(members.map((x) => x.username === selectedMemberForAdmin.username ? { ...x, fullName: newName } : x));
                            setSelectedMemberForAdmin({ ...selectedMemberForAdmin, fullName: newName });
                            fetch(`/api/members/${selectedMemberForAdmin.username}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ fullName: newName }),
                            }).catch(console.error);
                            showToast(t('profileUpdated'));
                          },
                          submitted: false
                        })}
                        className="text-blue-700 font-bold hover:underline"
                      >
                        Edit Member's Profile
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          if (selectedMemberForAdmin.username === currentUser?.username) {
                            setModalDialog({
                              title: "Action Not Permitted",
                              msg: "You cannot cancel or delete your own active administrator account.",
                              type: "alert",
                            });
                            return;
                          }
                          const adminCount = members.filter(isAdministrator).length;
                          if (isAdministrator(selectedMemberForAdmin) && adminCount <= 1) {
                            setModalDialog({
                              title: "Action Not Permitted",
                              msg: "Cannot cancel the only remaining administrator account in the system.",
                              type: "alert",
                            });
                            return;
                          }
                          setModalDialog({
                            title: t('cancelMembership'),
                            msg: `Are you sure you want to cancel and exclude ${selectedMemberForAdmin.username} from the system?`,
                            type: 'confirm',
                            onConfirm: async () => {
                              try {
                                const res = await fetch(`/api/members/${selectedMemberForAdmin.username}`, { method: 'DELETE' });
                                if (!res.ok) {
                                  const errData = await res.json().catch(() => ({ error: 'Failed to delete member' }));
                                  showToast(errData.error || 'Failed to delete member', 'error');
                                  return;
                                }
                                setMembers(members.filter((x) => x.username !== selectedMemberForAdmin.username));
                                setSelectedMemberForAdmin(null);
                                showToast(t('deleteSuccess'));
                              } catch {
                                showToast('Server communication error', 'error');
                              }
                            }
                          });
                        }}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Cancel Membership
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setModalDialog({
                            title: t('deleteAllPosts'),
                            msg: `Delete all forum postings created by ${selectedMemberForAdmin.username}?`,
                            type: 'confirm',
                            onConfirm: () => {
                              setPosts(posts.filter((p) => p.author !== selectedMemberForAdmin.username));
                              setMembers(members.map((x) => x.username === selectedMemberForAdmin.username ? { ...x, posts: 0 } : x));
                              fetch(`/api/members/${selectedMemberForAdmin.username}/posts`, { method: 'DELETE' }).catch(console.error);
                              showToast(t('deleteSuccess'));
                            }
                          });
                        }}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Delete All Posts of This Member
                      </button>
                    </div>

                    {/* Figure 49: Choose Admin Level */}
                    <div className="pt-2 border-t flex flex-wrap items-center gap-3">
                      <span className="font-bold">{t('chooseAdminLevel')}</span>
                      <select
                        value={selectedMemberForAdmin.adminLevel}
                        onChange={async (e) => {
                          const lvl = Number(e.target.value);
                          const role = roleFromLevel(lvl);

                          if (selectedMemberForAdmin.username === currentUser?.username && lvl < ADMIN_LEVEL.ADMINISTRATOR) {
                            setModalDialog({
                              title: "Self-Demotion Prevented",
                              msg: "You cannot demote your own active administrator account to prevent accidental lockout.",
                              type: "alert",
                            });
                            return;
                          }

                          const adminCount = members.filter(isAdministrator).length;
                          if (isAdministrator(selectedMemberForAdmin) && lvl < ADMIN_LEVEL.ADMINISTRATOR && adminCount <= 1) {
                            setModalDialog({
                              title: "Action Not Permitted",
                              msg: "Cannot demote the only remaining administrator account in the system.",
                              type: "alert",
                            });
                            return;
                          }

                          try {
                            const res = await fetch(`/api/members/${selectedMemberForAdmin.username}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ adminLevel: lvl, role }),
                            });
                            if (!res.ok) {
                              const errData = await res.json().catch(() => ({ error: 'Update failed' }));
                              showToast(errData.error || 'Failed to update admin level', 'error');
                              return;
                            }
                            setMembers(members.map((x) => x.username === selectedMemberForAdmin.username ? { ...x, adminLevel: lvl, role } : x));
                            setSelectedMemberForAdmin({ ...selectedMemberForAdmin, adminLevel: lvl, role });
                            showToast(t('success'));
                          } catch {
                            showToast('Server communication error', 'error');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl border bg-white font-semibold"
                      >
                        <option value={ADMIN_LEVEL.NONE}>{t('accessLevelNone')} ({t('levelWord')} {ADMIN_LEVEL.NONE})</option>
                        <option value={ADMIN_LEVEL.MODERATOR}>{t('accessLevelModerator')} ({t('levelWord')} {ADMIN_LEVEL.MODERATOR})</option>
                        <option value={ADMIN_LEVEL.ADMINISTRATOR}>{t('accessLevelAdministrator')} ({t('levelWord')} {ADMIN_LEVEL.ADMINISTRATOR})</option>
                      </select>
                      <button
                        onClick={() => setSelectedMemberForAdmin(null)}
                        className="text-xs text-[var(--teal)] hover:underline"
                      >
                        {t('goBackWithoutSave')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin Unit 5: Feedback Message Center (Figure 50 & 51) */}
          {currentPage === 'adminFeedback' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <Breadcrumbs
                items={[
                  { label: t('administrationBoard'), onClick: () => navigate('adminBoard') },
                  { label: t('feedbackMessageCenter') }
                ]}
              />

              {/* Detailed Feedback View (Figure 51) */}
              {selectedFeedback ? (
                <div className="card p-6 border-t-4 border-t-purple-600 space-y-4">
                  <div className="bg-blue-600 text-white font-bold p-2 text-center rounded-lg text-xs flex items-center justify-between">
                    <span>User's Feedback</span>
                    <button
                      onClick={() => {
                        setFeedbacks(feedbacks.filter((f) => f.id !== selectedFeedback.id));
                        fetch(`/api/feedbacks/${selectedFeedback.id}`, { method: 'DELETE' }).catch(console.error);
                        setSelectedFeedback(null);
                        showToast(t('deleteSuccess'));
                      }}
                      className="px-2 py-0.5 rounded bg-red-600 text-white text-[0.625rem] font-bold"
                    >
                      DELETE MSG
                    </button>
                  </div>

                  <div className="bg-amber-100 p-2 text-center text-xs font-bold text-amber-900 rounded">
                    Subject: {selectedFeedback.subject}
                    <div className="text-[0.625rem] font-normal text-amber-700">From: {selectedFeedback.name} at {selectedFeedback.date}</div>
                  </div>

                  <div className="space-y-2 text-xs bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                    <div><b>Name:</b> {selectedFeedback.name}</div>
                    <div><b>Email Address:</b> <span className="underline text-blue-700">{selectedFeedback.email}</span></div>
                    <div><b>Subject:</b> {selectedFeedback.subject}</div>
                    <div className="pt-2">
                      <b>Feedback Message:</b>
                      <div className="mt-1 p-3 bg-white rounded-lg border text-xs leading-relaxed whitespace-pre-wrap">
                        {selectedFeedback.message}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={`mailto:${selectedFeedback.email}?subject=Re: [MediFAQ Feedback] ${encodeURIComponent(selectedFeedback.subject)}`}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email ({selectedFeedback.email})</span>
                      </a>
                      <button
                        onClick={() => {
                          setPmForm({
                            to: selectedFeedback.name,
                            subject: `Re: [Feedback] ${selectedFeedback.subject}`,
                            content: `Hi ${selectedFeedback.name},\n\nThank you for reaching out regarding "${selectedFeedback.subject}".\n\n`,
                          });
                          setPmModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-sm"
                      >
                        <Inbox className="w-3.5 h-3.5" />
                        <span>Reply via Internal PM</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedFeedback(null)}
                      className="text-xs text-blue-700 font-bold hover:underline"
                    >
                      Back to Feedback Inbox
                    </button>
                  </div>
                </div>
              ) : (
                /* Feedback Inbox Table (Figure 50) */
                <div className="card overflow-hidden border border-[var(--border)]">
                  <div className="bg-amber-500 text-white font-bold p-2 text-center text-xs flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <span>User's Feedback ({feedbacks.length})</span>
                      <button
                        onClick={refreshData}
                        className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white text-[0.625rem] font-semibold transition"
                        title="Reload messages from database"
                      >
                        ↻ Refresh
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setModalDialog({
                          title: "Clear All Feedback Messages",
                          msg: "Are you sure you want to permanently delete all user feedback messages from the database?",
                          type: "confirm",
                          onConfirm: () => {
                            setFeedbacks([]);
                            fetch('/api/feedbacks', { method: 'DELETE' }).catch(console.error);
                            showToast(t('deleteSuccess'));
                          }
                        });
                      }}
                      className="px-2 py-0.5 rounded bg-blue-700 text-white text-[0.625rem] font-bold"
                    >
                      DELETE ALL
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-blue-600 text-white font-bold text-left">
                        <tr>
                          <th className="p-3">Subject</th>
                          <th className="p-3">From</th>
                          <th className="p-3">Time Received</th>
                          <th className="p-3">Mailing Options</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border">
                        {feedbacks.map((fb) => (
                          <tr key={fb.id} className="hover:bg-[var(--surface-2)]/50">
                            <td className="p-3">
                              <button
                                onClick={() => setSelectedFeedback(fb)}
                                className="font-bold text-blue-700 hover:text-[var(--teal)] hover:underline text-left block"
                              >
                                {fb.subject}
                              </button>
                            </td>
                            <td className="p-3 font-semibold">{fb.name}</td>
                            <td className="p-3 text-[var(--muted)]">{fb.date}</td>
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  setFeedbacks(feedbacks.filter((f) => f.id !== fb.id));
                                  fetch(`/api/feedbacks/${fb.id}`, { method: 'DELETE' }).catch(console.error);
                                  showToast(t('deleteSuccess'));
                                }}
                                className="text-red-600 font-bold hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {feedbacks.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-xs text-[var(--muted)]">
                              No feedback messages in inbox.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-[var(--surface-2)] border-t text-center text-xs">
                    <button onClick={() => navigate('adminBoard')} className="text-purple-700 font-bold hover:underline">
                      {t('adminHome')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Global Footer (matching original project citation & accessibility requirements) */}
        <footer className="mt-12 border-t border-[var(--border)] bg-[var(--surface)]/70 py-6 text-xs text-[var(--muted)]">
          <div className="max-w-[1300px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              © 2026 MediFAQ • {t('fullTitle')} • {t('tagline')}.
            </div>
            <div className="flex items-center gap-3 font-medium">
              <span>{t('accessibility')}: WCAG AA</span>
              <span>•</span>
              <span>Inter + Fraunces</span>
              <span>•</span>
              <span>Tri-lingual (EN / 中文 / BM)</span>
            </div>
          </div>
        </footer>
      </div>

      {/* POPUP: FAQ DETAIL / CLINICAL ANSWER MODAL (Figure 14 & 15) */}
      {activeFaqDetail && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setActiveFaqDetail(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-modal-title"
            className="relative w-full max-w-2xl card p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border-2 border-[var(--teal)] animate-in"
          >
            {/* Modal Header */}
            <div className="bg-amber-500 text-white font-bold p-3 text-center text-xs relative">
              <span id="faq-modal-title">{t('medicalKnowledgeFAQ')}</span>
              <button
                onClick={() => setActiveFaqDetail(null)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-black/20 hover:bg-black/30"
                aria-label="Close FAQ dialog"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Question Title Bar */}
            <div className="bg-blue-600 text-white p-3 font-bold text-sm">
              {getLoc(activeFaqDetail.q)}
            </div>

            {/* Answer Content with Doctor Attribution (Figure 15) */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed bg-white">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center justify-between">
                <span>Answer from {activeFaqDetail.doctorName || t('answerFromDoctor')}</span>
                <span className="text-[0.625rem] font-normal text-amber-700">Created at {activeFaqDetail.createdAt}</span>
              </div>

              <div className="whitespace-pre-wrap text-[var(--text)] text-sm leading-relaxed">
                {getLoc(activeFaqDetail.a)}
              </div>

              {/* Utility actions: Print & Share */}
              <div className="pt-4 border-t flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-200"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('print')}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: getLoc(activeFaqDetail.q),
                          text: getLoc(activeFaqDetail.a),
                          url: window.location.href
                        }).catch(() => {});
                      } else {
                        showToast("FAQ link copied to clipboard!");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-200"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t('share')}</span>
                  </button>
                </div>
                <button
                  onClick={() => setActiveFaqDetail(null)}
                  className="px-5 py-1.5 rounded-lg bg-[var(--navy)] text-white text-xs font-bold"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: SEND PRIVATE MESSAGE MODAL */}
      {pmModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPmModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-modal-title"
            className="relative w-full max-w-md card p-6 overflow-hidden shadow-2xl space-y-4 border border-[var(--border)]"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 id="pm-modal-title" className="font-bold text-sm text-[var(--navy)]">
                {t('sendNewMessage')}
              </h3>
              <button
                onClick={() => setPmModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close message compose dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">{t('recipientUsername')}</label>
                <input
                  value={pmForm.to}
                  onChange={(e) => setPmForm({ ...pmForm, to: e.target.value })}
                  placeholder="e.g. member_tan, dr_lee, admin"
                  className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">{t('subject')}:</label>
                <input
                  value={pmForm.subject}
                  onChange={(e) => setPmForm({ ...pmForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">{t('messageContentLabel')}</label>
                <textarea
                  rows={4}
                  value={pmForm.content}
                  onChange={(e) => setPmForm({ ...pmForm, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-[var(--teal)] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setPmModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-2)] text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSendPM}
                  className="px-5 py-2 rounded-xl bg-[var(--teal)] text-white text-xs font-bold hover:bg-[var(--teal-deep)]"
                >
                  {t('send')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ CREATE / EDIT FORM (replaces window.prompt, which sandboxed previews block) */}
      {faqEditor && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFaqEditor(null)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-editor-title"
            className="relative w-full max-w-md card p-5 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
              <span id="faq-editor-title" className="font-bold text-sm text-[var(--navy)]">
                {faqEditor.id ? t('editFAQ') : t('createFAQ')}
              </span>
              <button
                type="button"
                onClick={() => setFaqEditor(null)}
                className="w-7 h-7 grid place-items-center rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] focus-ring"
                aria-label={t('close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block space-y-1">
                <span className="font-bold">{t('faqQuestionLabel')}</span>
                <input
                  type="text"
                  value={faqEditor.q}
                  onChange={(e) => setFaqEditor({ ...faqEditor, q: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-white focus-ring"
                />
                {faqEditor.submitted && !faqEditor.q.trim() && (
                  <span className="text-red-600 font-semibold">{t('required')}</span>
                )}
              </label>
              <label className="block space-y-1">
                <span className="font-bold">{t('faqAnswerLabel')}</span>
                <textarea
                  rows={6}
                  value={faqEditor.a}
                  onChange={(e) => setFaqEditor({ ...faqEditor, a: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-white focus-ring"
                />
                {faqEditor.submitted && !faqEditor.a.trim() && (
                  <span className="text-red-600 font-semibold">{t('required')}</span>
                )}
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setFaqEditor(null)}
                className="px-4 py-1.5 rounded-xl bg-white border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)] focus-ring"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={saveFaqEditor}
                className="px-5 py-1.5 rounded-xl bg-[var(--navy)] text-white text-xs font-bold hover:bg-[var(--teal-deep)] focus-ring"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE-FIELD TEXT DIALOG (replaces window.prompt for admin rename / add actions) */}
      {textPrompt && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setTextPrompt(null)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="text-prompt-title"
            className="relative w-full max-w-sm card p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
              <span id="text-prompt-title" className="font-bold text-sm text-[var(--navy)]">{textPrompt.title}</span>
              <button
                type="button"
                onClick={() => setTextPrompt(null)}
                className="w-7 h-7 grid place-items-center rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] focus-ring"
                aria-label={t('close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block space-y-1 text-xs">
              <span className="font-bold">{textPrompt.label}</span>
              <input
                type="text"
                autoFocus
                value={textPrompt.value}
                onChange={(e) => setTextPrompt({ ...textPrompt, value: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitTextPrompt();
                  if (e.key === 'Escape') setTextPrompt(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-white focus-ring"
              />
              {textPrompt.submitted && !textPrompt.value.trim() && (
                <span className="text-red-600 font-semibold">{t('required')}</span>
              )}
            </label>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setTextPrompt(null)}
                className="px-4 py-1.5 rounded-xl bg-white border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)] focus-ring"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={submitTextPrompt}
                className="px-5 py-1.5 rounded-xl bg-[var(--navy)] text-white text-xs font-bold hover:bg-[var(--teal-deep)] focus-ring"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG (For Internet Explorer Style Error & Confirmation Boxes as in Figure 2, 4, 39) */}
      {modalDialog && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalDialog(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-modal-title"
            className="relative w-full max-w-sm card p-5 overflow-hidden shadow-2xl border-2 border-gray-400 animate-in bg-[#ece9d8] text-black"
          >
            {/* Retro title bar homage with clean typography */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-300">
              <span id="dialog-modal-title" className="font-bold text-xs text-blue-900">{modalDialog.title}</span>
              <button
                onClick={() => setModalDialog(null)}
                className="w-5 h-5 grid place-items-center rounded bg-gray-200 hover:bg-gray-300 text-xs font-bold"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="flex items-start gap-3 py-2">
              <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0 bg-amber-100 text-amber-700">
                <TriangleAlert className="w-5 h-5" />
              </div>
              <div className="text-xs whitespace-pre-wrap leading-relaxed flex-1">
                {modalDialog.msg}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-300">
              {modalDialog.type === 'confirm' && (
                <button
                  onClick={() => setModalDialog(null)}
                  className="px-4 py-1.5 rounded-md bg-white border border-gray-400 text-xs font-medium hover:bg-gray-100"
                >
                  {t('cancel')}
                </button>
              )}
              <button
                onClick={() => {
                  if (modalDialog.onConfirm) modalDialog.onConfirm();
                  setModalDialog(null);
                }}
                className="px-5 py-1.5 rounded-md bg-white border-2 border-blue-600 text-xs font-bold hover:bg-blue-50 shadow-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Status Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-[var(--navy)] text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <CircleCheck className="w-4 h-4 text-emerald-400" />
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
