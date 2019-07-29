﻿import * as React from 'react';
import UpInput, { CommonProps } from "../Input";
import { BaseControlComponent } from "../_Common/BaseControl/BaseControl";
import TypeNumberControl from "../_Common/Validation/TypeNumberControl";
import { style } from "typestyle";
import UpBox from '../../Containers/Box';
import withTheme from '../../../Common/theming/withTheme';
import defaultTheme from '../../../Common/theming';
import UpButton from '../Button/UpButton';
import { eventFactory } from '../../../Common/utils/eventListener';

export interface UpNumberProps extends CommonProps<number | string> {
   max?: number;
   min?: number;
   stepSize?: number;
   decimalPlace?: number;
   value?: number | string;
   hideButtons?: boolean;
}

export interface UpNumberStyledProps extends UpNumberProps {
   dataFor?: string; // For tooltip
   handleNumericChange?: (valueAsNumber: number, valueAsString: string) => void;
}

const wrapperNumberStyles = (props : UpNumberProps) => style({
    position: 'relative',
    $nest : {
        'input' : {
            textAlign: 'right',
            paddingRight : props.theme.inputBorderLess ? '42px !important' : '26px !important',
        },
        '.up-btn-wrapper' : {
            height: '16px',
        },
        '.up-input-group > .up-icon-wrapper:last-child' : {
            right:'-14px'
        }
    }
})

const wrapperNumberButtonsStyles = (props : UpNumberProps) => style({
    position: 'absolute', 
    right: props.theme.inputBorderLess ? '0px' : '2px',
    bottom: props.theme.inputBorderLess ? '7px' : '2px',
    $nest : {
        '& .up-btn-wrapper .up-btn .up-icon-wrapper svg' : {
            margin: '0px',
        },
        '& .up-btn-wrapper .up-btn' : {
            marginLeft: '4px',
        },
        '& .up-btn-wrapper' : {
            width: 'auto',
        }
    },
})

class UpNumber extends BaseControlComponent<UpNumberProps, number | string> {
   
    public static defaultProps : UpNumberProps = {
       showError: true,
       max: Infinity,
       min: -Infinity,
       theme: defaultTheme,
   };

   constructor(p, c) {
       super(p, c);
       this.state = {
           value: p.value
       }
       this._validationManager.addControl(new TypeNumberControl(this.props.decimalPlace === 0, this.props.min, this.props.max));
   }

   handleNumericChange = (event: React.ChangeEvent<any>, valueAsString: string) => {
    if ( valueAsString.match(/^(\d+([,.]\d*)?)?$/)) {
           this.handleChangeEvent(event, valueAsString);
       }
    }

    displayDecimalWithComma = (numberAsString: string) =>{
        return numberAsString.replace('.',',');
    }

   applyDecimalPlace = (value: string) =>{
    //replace , by . to convert correctly the string with parseFloat
    let _value: string | number = value.replace(',','.');
    _value = parseFloat(_value);
    if (this.props.decimalPlace != null) {
       _value = _value.toFixed(this.props.decimalPlace)
    }
    _value = _value.toString();
    return this.displayDecimalWithComma(_value);
   }

   handleNumericBlur = (event: React.ChangeEvent<any>) => {
    let value = event.target.value.replace(',','.');
    if (value && value.match(/^(\d+([,.]\d*)?)?$/)) {
        this.handleChangeEvent(event, this.applyDecimalPlace(value));
     }
   }

   getValue(value) {
       return value;
   }

   increment = () => {
        let newValue: string | number = parseFloat((this.currentValue || 0).toString().replace(',','.'));
        if(isNaN(newValue)) {
            newValue = 0 ;
        }

        newValue += this.props.stepSize ? this.props.stepSize : 1 ;

        if(this.props.max != null && newValue > this.props.max) {
            newValue = this.props.max
        }
        if(this.props.decimalPlace != null)
            newValue = this.applyDecimalPlace(newValue.toString());
        else newValue = newValue.toFixed(0).toString();
        this.setState({ value: newValue}, () => {
            this.handleChangeEvent(eventFactory(this.props.name, this.state.value), this.state.value);
        }) 
   }

   decrement = () => {
        let newValue: string | number = parseFloat((this.currentValue || 0).toString().replace(',','.'));
        if(isNaN(newValue)) {
            newValue = 0 ;
        }
        
        newValue -= this.props.stepSize ? this.props.stepSize : 1 ;
      
        if(this.props.min != null && newValue < this.props.min) {
            newValue = this.props.min
        }
        if(this.props.decimalPlace != null)
            newValue = this.applyDecimalPlace(newValue.toString());
        else newValue = newValue.toFixed(0).toString();
        this.setState({ value: newValue}, () => {
            this.handleChangeEvent(eventFactory(this.props.name, this.state.value), this.state.value);
        }); 
   }
    
   showError() {
        return this.props.showError !== undefined
            ? this.props.showError === true
            : this.hasError;
    }
    
    showSuccess() {
        return false
    }

   renderControl() {
       const { isRequired, theme, readonly, tooltip, placeholder, name } = this.props;
    
       return (
           <div className={wrapperNumberStyles(this.props)}>
            <UpInput  
                    placeholder={placeholder}
                    name={name}
                    tooltip={tooltip}
                    readonly={readonly}
                    isRequired={isRequired}
                    value={this.currentValue != null ? this.currentValue.toString() : "" } 
                    onChange={(event, value) => { event.persist() ; this.handleNumericChange(event, value) }}
                    onBlur={(event) => { event.persist() ; this.handleNumericBlur(event) }}/>
             {!this.props.hideButtons && <UpBox className={wrapperNumberButtonsStyles(this.props)} flexDirection={theme.inputBorderLess ? 'row' : 'column-reverse'}>
                <UpButton intent={'primary'} width={'icon'} iconSize={9} height={'xsmall'} onClick={this.decrement} iconName={'arrow-down'}></UpButton>
                <UpButton intent={'primary'} width={'icon'} iconSize={9} height={'xsmall'} onClick={this.increment} iconName={'arrow-up'}></UpButton>
             </UpBox>}
           </div>
       );
   }
}

export default withTheme<UpNumberProps>(UpNumber)