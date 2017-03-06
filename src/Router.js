import { createRouter } from '@exponent/ex-navigation';
import LoginScreen from './components/screens/LoginScreen';
import OAuthScreen from './components/screens/OAuthScreen';
import HomeScreen from './components/screens/HomeScreen';

import ProjectListScreen from './components/screens/ProjectListScreen';
import ProjectScreen from './components/screens/ProjectScreen';
import BugScreen from './components/screens/BugScreen';
import BugEditScreen from './components/screens/BugEditScreen';

import ProfileScreen from './components/screens/ProfileScreen';
import SettingsScreen from './components/screens/SettingsScreen';

import ReportBugScreen from './components/screens/BugReportScreen';
import BugReportFormScreen from './components/screens/BugReportFormScreen';
import BugPriorityScreen from './components/screens/BugPriorityScreen';
import BugSeverityScreen from './components/screens/BugSeverityScreen';
import BugTypeScreen from './components/screens/BugTypeScreen';
import BugStatusScreen from './components/screens/BugStatusScreen';
import BugStepsScreen from './components/screens/BugStepsScreen';
import ProjectComponentScreen from './components/screens/ProjectComponentScreen';
import ProjectVersionScreen from './components/screens/ProjectVersionScreen';
import ProjectFinderScreen from './components/screens/ProjectFinderScreen';

export const Router = createRouter(() => ({
  login: () => LoginScreen,
  oauth: () => OAuthScreen,
  home: () => HomeScreen,
  projects: () => ProjectListScreen,
  project: () => ProjectScreen,
  bug: () => BugScreen,
  bugEdit: () => BugEditScreen,
  profile: () => ProfileScreen,
  settings: () => SettingsScreen,

  projectFinder: () => ProjectFinderScreen,

  report: () => ReportBugScreen,
  bugForm: () => BugReportFormScreen,
  bugPriority: () => BugPriorityScreen,
  bugSeverity: () => BugSeverityScreen,
  bugType: () => BugTypeScreen,
  bugStatus: () => BugStatusScreen,
  bugSteps: () => BugStepsScreen,
  bugComponent: () => ProjectComponentScreen,
  bugVersion: () => ProjectVersionScreen,
}));

export default Router;
