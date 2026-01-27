import { ResolveAsComponentOrHelperHeadResolution, ResolveAsHelperHeadResolution, ResolveAsComponentHeadResolution, ResolveAsModifierHeadResolution, StrictResolution, Statements, Statement, Expression, Expressions } from '@glimmer/interfaces';

declare const opcodes: {
    readonly Append: 1;
    readonly TrustingAppend: 2;
    readonly Comment: 3;
    readonly Modifier: 4;
    readonly StrictModifier: 5;
    readonly Block: 6;
    readonly StrictBlock: 7;
    readonly Component: 8;
    readonly OpenElement: 10;
    readonly OpenElementWithSplat: 11;
    readonly FlushElement: 12;
    readonly CloseElement: 13;
    readonly StaticAttr: 14;
    readonly DynamicAttr: 15;
    readonly ComponentAttr: 16;
    readonly AttrSplat: 17;
    readonly Yield: 18;
    readonly DynamicArg: 20;
    readonly StaticArg: 21;
    readonly TrustingDynamicAttr: 22;
    readonly TrustingComponentAttr: 23;
    readonly StaticComponentAttr: 24;
    readonly Debugger: 26;
    readonly Undefined: 27;
    readonly Call: 28;
    readonly Concat: 29;
    readonly GetSymbol: 30;
    readonly GetLexicalSymbol: 32;
    readonly GetStrictKeyword: 31;
    readonly GetFreeAsComponentOrHelperHead: 35;
    readonly GetFreeAsHelperHead: 37;
    readonly GetFreeAsModifierHead: 38;
    readonly GetFreeAsComponentHead: 39;
    readonly InElement: 40;
    readonly If: 41;
    readonly Each: 42;
    readonly Let: 44;
    readonly WithDynamicVars: 45;
    readonly InvokeComponent: 46;
    readonly HasBlock: 48;
    readonly HasBlockParams: 49;
    readonly Curry: 50;
    readonly Not: 51;
    readonly IfInline: 52;
    readonly GetDynamicVar: 53;
    readonly Log: 54;
};

type resolution = ResolveAsComponentOrHelperHeadResolution | ResolveAsHelperHeadResolution | ResolveAsComponentHeadResolution | ResolveAsModifierHeadResolution | StrictResolution;
declare const resolution: {
    readonly Strict: 0;
    readonly ResolveAsComponentOrHelperHead: 1;
    readonly ResolveAsHelperHead: 5;
    readonly ResolveAsModifierHead: 6;
    readonly ResolveAsComponentHead: 7;
};

declare const WellKnownAttrNames: {
    readonly class: 0;
    readonly id: 1;
    readonly value: 2;
    readonly name: 3;
    readonly type: 4;
    readonly style: 5;
    readonly href: 6;
};
declare const WellKnownTagNames: {
    readonly div: 0;
    readonly span: 1;
    readonly p: 2;
    readonly a: 3;
};

declare function is<T>(variant: number): (value: unknown) => value is T;
declare const isFlushElement: (value: unknown) => value is Statements.FlushElement;
declare function isAttribute(val: Statement): val is Statements.Attribute;
declare function isStringLiteral(expr: Expression): expr is Expressions.StringValue;
declare function getStringFromValue(expr: Expressions.StringValue): string;
declare function isArgument(val: Statement): val is Statements.Argument;
declare function isHelper(expr: Expression): expr is Expressions.Helper;
declare const isGet: (value: unknown) => value is Expressions.GetSymbol;

export { opcodes as SexpOpcodes, resolution as VariableResolutionContext, WellKnownAttrNames, WellKnownTagNames, getStringFromValue, is, isArgument, isAttribute, isFlushElement, isGet, isHelper, isStringLiteral };
