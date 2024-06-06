import * as React from 'react';
import S31Editor, { EditorProps } from 's31-editor';

const LexicalComponent = (props: EditorProps) => {
  return (
    <div className="relative justify-center bg-white  rounded-[16px] h-full w-full">
      <S31Editor {...props}></S31Editor>
    </div>
  );
};

export default LexicalComponent;
