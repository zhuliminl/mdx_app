import AuthenticationCenter from "./pages/auth";
import BackSuccess from "./pages/BackSuccess";
import BorrowRecords from "./pages/BorrowRecords";
import Contacts from "./pages/contacts/Contacts";
import Back from "./pages/Back";
import MyCenter from "./pages/MyCenter";
import Logup from "./pages/Logup";
import BorrowCenter from "./pages/BorrowCenter";
import BorrowConfirm from "./pages/BorrowConfirm";
import AddBankCard from "./pages/AddBankCard";
import Messages from "./pages/Messages";
import Waiting from "./pages/Waiting";
import BorrowDetail from "./pages/BorrowDetail";
import SetPassword from "./pages/SetPassword";
import ResetPassword from "./pages/ResetPassword";
import Feedback from "./pages/Feedback";
import Upgrade from "./pages/Upgrade";
import PWViewer from "./pages/PWViewer";
import NetworkError from "./pages/NetworkError";
import AuthFailed from './pages/AuthFailed'

export const routes = {

  Waiting: {
    screen: Waiting
  },
  Logup: {
    screen: Logup,
  },
  AuthenticationCenter: {
    screen: AuthenticationCenter
  },
  MyCenter: {
    screen: MyCenter
  },
  AddBankCard: {
    screen: AddBankCard
  },
  BorrowCenter: {
    screen: BorrowCenter
  },
  BorrowConfirm: {
    screen: BorrowConfirm
  },
  BorrowRecords: {
    screen: BorrowRecords
  },
  BorrowDetail: {
    screen: BorrowDetail
  },
  Back: {
    screen: Back
  },
  Messages: {
    screen: Messages
  },
  BackSuccess: {
    screen: BackSuccess
  },
  Contacts: {
    screen: Contacts
  },
  SetPassword: {
    screen: SetPassword
  },
  ResetPassword: {
    screen: ResetPassword
  },
  Feedback: {
    screen: Feedback
  },
  Upgrade: {
    screen: Upgrade
  },
  PWViewer: {
    screen: PWViewer
  },
  NetworkError: {
    screen: NetworkError
  },
  AuthFailed: {
    screen: AuthFailed
  }
};
