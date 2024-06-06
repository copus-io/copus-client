import { Dispatch, SetStateAction, createContext } from 'react';
import type { CreateOpusReqParams } from 'src/api/createOpus';

const CreateOpusContext = createContext<{
  data: CreateOpusReqParams;
  setData: Dispatch<SetStateAction<CreateOpusReqParams>>;
}>(null!);

export default CreateOpusContext;
