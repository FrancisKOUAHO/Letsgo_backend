function sliceNameAndLastname(wordText: String) {
    let words = wordText;
    let splitted = words.split(' ');
    return splitted[0];
}

export default sliceNameAndLastname
