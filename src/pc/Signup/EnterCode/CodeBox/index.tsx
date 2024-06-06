import { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';

interface CodeProps {
  onCodeChange: (code: string) => void;
  onCodeComplete: (code: string) => void;
}
const CodeBox = (props: CodeProps) => {
  const { onCodeChange, onCodeComplete } = props;
  const inputRef = useRef<Array<HTMLInputElement>>([]);

  const [code, setCode] = useState(new Array(6).fill(''));
  const [inputIndex, setInputIndex] = useState(0);
  const [inputIndexMax, setInputIndexMax] = useState(false);

  // 读取粘贴板
  const readClipboard = (e: any) => {
    const pasteText = (e.clipboardData || window.Clipboard)
      .getData('text')
      .trim();
    const data = pasteText.split('').slice(0, 6);

    let regex = /^[A-Za-z0-9]+$/;
    const newCode = code.map((v) => v);
    data.forEach((item: any, index: number) => {
      if (!regex.exec(item)) {
        return;
      }
      newCode[index] = item;
    });
    setCode(newCode);
    if (newCode.every((v) => v !== '')) {
      e.target.blur();
      setInputIndex(6);

      setInputIndexMax(true);
      onCodeComplete(newCode.join(''));
    }
  };

  useEffect(() => {
    inputRef.current[0].focus();
    document.addEventListener('paste', readClipboard);
    return function cleanup() {
      document.removeEventListener('paste', readClipboard);
    };
  }, []);

  // 聚焦
  const focusOn = (index: number) => {
    const el = inputRef.current[index];
    if (el) {
      el.focus();
    }
  };

  // 输入框 change 事件
  const handleChange = (e: any, i: number) => {
    const value = e.target.value;
    console.log('va', value);
    let regex = /^[A-Za-z0-9]+$/;
    if (!regex.exec(value) && value.length > 0) {
      return;
    }
    // let v = regex.exec(value);
    // console.log('reg',v);

    const newCode = code.map((v) => v);

    newCode[i] = value;
    setCode(newCode);
    setInputIndex(i + 1);
    onCodeChange(newCode.join(''));
    if (newCode.every((v) => v !== '')) {
      setInputIndexMax(true);
      e.target.blur();
      onCodeComplete(newCode.join(''));

      return;
    }
    if (value !== '') {
      console.log('index', i);
      focusOn(i + 1);
    }
  };

  // 键盘事件
  const onKeyDown = (e: any, i: number) => {
    if (e.keyCode === 8) {
      if (e.target.value === '') {
        setInputIndexMax(false);

        // 如果空的话，那么就退回到上一个输入框
        focusOn(i - 1);
      }
    }
  };
  useEffect(() => {
    if (inputIndexMax) {
      document.onkeyup = (e) => {
        if (e.key === 'Backspace') {
          // Del键
          const newCode = code.map((v) => v);
          newCode[inputIndex - 1] = '';
          setCode(newCode);
          focusOn(inputIndex - 1);
          onCodeChange(newCode.join(''));
        }
      };
    }
    return () => {
      document.onkeyup = null;
    };
  }, [inputIndexMax]);

  return (
    <div className="wrapper">
      <input
        className={styles.codeInput}
        ref={(el) => {
          inputRef.current[0] = el!;
        }}
        maxLength={1}
        autoComplete="false"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={code[0]}
        onChange={(e) => {
          handleChange(e, 0);
        }}
        onKeyDown={(e) => {
          onKeyDown(e, 0);
        }}
      />
      <input
        className={styles.codeInput}
        ref={(el) => {
          inputRef.current[1] = el!;
        }}
        maxLength={1}
        autoComplete="false"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={code[1]}
        onChange={(e) => {
          handleChange(e, 1);
        }}
        onKeyDown={(e) => {
          onKeyDown(e, 1);
        }}
      />
      <input
        className={styles.codeInput}
        ref={(el) => {
          inputRef.current[2] = el!;
        }}
        maxLength={1}
        autoComplete="false"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={code[2]}
        onChange={(e) => {
          handleChange(e, 2);
        }}
        onKeyDown={(e) => {
          onKeyDown(e, 2);
        }}
      />
      <input
        className={styles.codeInput}
        ref={(el) => {
          inputRef.current[3] = el!;
        }}
        maxLength={1}
        autoComplete="false"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={code[3]}
        onChange={(e) => {
          handleChange(e, 3);
        }}
        onKeyDown={(e) => {
          onKeyDown(e, 3);
        }}
      />
      <input
        className={styles.codeInput}
        ref={(el) => {
          inputRef.current[4] = el!;
        }}
        maxLength={1}
        autoComplete="false"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={code[4]}
        onChange={(e) => {
          handleChange(e, 4);
        }}
        onKeyDown={(e) => {
          onKeyDown(e, 4);
        }}
      />
      <input
        className={styles.codeInput}
        ref={(el) => {
          inputRef.current[5] = el!;
        }}
        maxLength={1}
        autoComplete="false"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={code[5]}
        onChange={(e) => {
          handleChange(e, 5);
        }}
        onKeyDown={(e) => {
          onKeyDown(e, 5);
        }}
      />
    </div>
  );
};

export default CodeBox;
