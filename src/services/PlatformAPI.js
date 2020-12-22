import {isMobile, isIE} from 'react-device-detect'

export default PlatformAPI = {
  isMobile: () => isMobile,
  isIE: () => isIE
}
