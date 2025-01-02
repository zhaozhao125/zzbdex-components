import { makeInstaller } from './make-installer'
import ZzbdexEditor from './components/editor'
const plugins = [
  ZzbdexEditor
]

export default makeInstaller([...plugins])
