import { useContext } from 'react';
import SpaceInfoContext from 'src/context/space-info-context';

const useSpaceInfo = () => useContext(SpaceInfoContext);

export default useSpaceInfo;
