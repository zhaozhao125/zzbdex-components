
import { makeInstaller } from './make-installer'
import Editor from './components/editor'
import AmountInput from './components/amountInput'
import FileUpload from './components/fileUpload'
const plugins = [
  Editor,
  AmountInput
]

const installer = makeInstaller([...plugins])

export default installer

export const install = installer.install;

export const ZzbdexEditor = Editor;
export const ZzbdexAmountInput = AmountInput;
export const ZzbdexFileUpload = FileUpload;
