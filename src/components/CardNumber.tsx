import React, { useContext, useEffect } from "react";
import { StyleSheet, View, TextInput, Image } from "react-native";

import MaskInput from "react-native-mask-input";

import { BIN_CHANGE, CARD_CHANGE } from "../utils/actions";
import { FramesConsumer, FramesContext } from "../Frames";
import { FramesCardFieldProps } from "../types/types";
import { DEFAULT_CARD_NUMBER_PLACEHOLDER } from "../utils/constants";

const CardNumber: React.FC<FramesCardFieldProps> = (props) => {
  const { dispatch } = useContext(FramesContext);

  useEffect(() => {
    dispatch({ type: CARD_CHANGE, payload: props.value });
  }, [props.value]);

  return (
    <FramesConsumer>
      {({ state, dispatch }) => {
        if (state?.cardNumber === undefined) {
          throw "It looks like you are trying to render the CardNumber outside of the Frames Component.";
        }
        return (
          <View style={styles.wrapper}>
            <MaskInput
              autoCompleteType="cc-number"
              keyboardType="number-pad"
              returnKeyType="done"
              placeholder={DEFAULT_CARD_NUMBER_PLACEHOLDER}
              {...props}
              value={state.cardNumber}
              style={[styles.cardNumber, props.style]}
              mask={props.mask}
              onChangeText={(val: string) => {
                if (val.length > 19) {
                  return;
                }
                dispatch({ type: CARD_CHANGE, payload: val });
                props.onChangeText && props.onChangeText(val);
                if (
                  val.replace(/[^0-9]/g, "").length >= 8 &&
                  val.replace(/[^0-9]/g, "").substring(0, 8) !==
                    state.cardBin.bin
                ) {
                  dispatch({
                    type: BIN_CHANGE,
                    payload: val.replace(/[^0-9]/g, "").substring(0, 8),
                  });
                }
              }}
            />
            {props.showIcon === undefined || props.showIcon ? (
              <View style={styles.schemeIconContainer}>
                {state.cardIcon ? (
                  <Image style={styles.scheme} source={state.cardIcon} />
                ) : undefined}
              </View>
            ) : undefined}
          </View>
        );
      }}
    </FramesConsumer>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#00000000",
  },
  cardNumber: {
    borderColor: "black",
    borderWidth: 1,
    minHeight: 30,
    paddingLeft: 15,
  },
  schemeIconContainer: {
    height: "100%",
    right: 10,
    width: 50,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  scheme: {
    height: "50%",
    width: "100%",
    resizeMode: "contain",
    alignItems: "center",
  },
});

export default CardNumber;
