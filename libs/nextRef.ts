const onNext = (nextOne: React.MutableRefObject<any>) => {
  nextOne?.current?.focus();
};

export default onNext;
