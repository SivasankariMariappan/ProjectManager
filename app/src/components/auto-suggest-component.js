import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

/**
 * This component is used to provide auto suggest textbox. It takes the list of suggestion labels in props.
 * Suggestions should of the form [ {label: "Suggestion 1"}, {label: "Suggestion 2"} ]
 *
 * Usage: <AutoSuggestComponent suggestions={this.mySuggestions} />
 */

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;
  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input
        },
        ...other
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      style={{
        margin: "0px 4px",
        borderBottom: "solid 1px #dfdfdf",
        fontWeight: isHighlighted ? "bold" : 400,
        "&:lastChild": {
          borderBottom: "none"
        }
      }}
    >
      <div>{suggestion.label}</div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;
  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.value;
}

function getSuggestions(suggestions, value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: "relative",
    width: "100%"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    height: 280
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  }
});

class IntegrationAutosuggest extends React.Component {
  state = {
    value: "",
    suggestions: []
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    if (value.length > 2) {
      let suggestions = getSuggestions(
        [..._.uniqBy(this.props.suggestions, "label")],
        value
      );

      let exists = false;
      suggestions.forEach(suggestion => {
        if (suggestion.label.toLowerCase() === value.toLowerCase()) {
          exists = true;
        }
      });
      if (!exists && suggestions.length === 0) {
        suggestions.push({
          label: "No matches found",
          value: ""
        });
      }

      this.setState({
        suggestions: suggestions
      });
    }
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    const { inputchangecallback } = this.props;
    inputchangecallback && inputchangecallback(newValue);
    this.setState({
      value: newValue
    });
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    const { onSuggestionSelected } = this.props;
    onSuggestionSelected && onSuggestionSelected(suggestion);
  };

  clearInput() {
    this.setState({ value: "" });
  }

  render() {
    const { classes } = this.props;
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          value: this.props.value,
          onChange: this.handleChange,
          placeholder: this.props.placeholder,
          disabled: this.props.disabled
        }}
        highlightFirstSuggestion={true}
      />
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.array.isRequired
};

export default withStyles(styles)(IntegrationAutosuggest);
