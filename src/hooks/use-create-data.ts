import { useContext } from 'react';
import CreateOpusContext from 'src/context/create-opus-context';

const useCreateData = () => useContext(CreateOpusContext);

export default useCreateData;
